<script setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import { Search, Send, Group } from "@iconoir/vue";
import * as signalR from "@microsoft/signalr";
import {useMutation, useQuery, useQueryClient} from "@tanstack/vue-query";
import { useUser } from "@/modules/auth/sdk/user.js";
import {getAllAppUserDoctors, getChatMessages, sendChatMessage} from "@/modules/doctor/sdk/api.js";
import moment from "moment";

const { user } = useUser();
const search = ref("");
const selectedChat = ref(null);
const newMessage = ref("");
let connection;
const chatScroll = ref(null);
const bottomMarker = ref(null);
const queryClient = useQueryClient();

const currentUserId = computed(() => {
  return String(user.value?.id ?? "");
});

const isMine = (senderId) => {
  if (!senderId) return false;
  return String(senderId).toLowerCase() === currentUserId.value;
}

const { data: doctors, error: doctorsError, isLoading: isLoadingDoctors } = useQuery({
  queryKey: ["chat-doctors"],
  queryFn: () => getAllAppUserDoctors(true),
  select: (data) => data.filter(d => d.applicationUserId !== currentUserId.value),
  refetchOnWindowFocus: false
});

onMounted(() => {
  connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5233/chatHub", {
        accessTokenFactory: () => user.value?.token,
        withCredentials: true
      })
      .withAutomaticReconnect()
      .build();

  connection.start().then(() => {
    console.log("Connected to ChatHub");
  }).catch(err => console.error(err.toString()));

  connection.on("ReceiveMessage", (senderId, receiverId, message) => {
    const currentChatPartnerId = selectedChat.value?.applicationUserId;

    if (senderId === currentChatPartnerId || currentUserId.value === senderId) {

      queryClient.setQueryData(
          ["doctor-chat", currentChatPartnerId],
          (oldMessages) => {
            if (senderId === currentUserId.value) {
              return oldMessages;
            }

            const newMessageObject = {
              senderId: senderId,
              message: message,
              sentAt: new Date().toISOString()
            };

            return [...(oldMessages || []), newMessageObject];
          }
      );
    }
  });
});

const { data: drChat, error: drChatError, isLoading: isLoadingDrChat } = useQuery({
  queryKey: computed(() => ["doctor-chat", selectedChat.value?.applicationUserId]),
  queryFn: () => getChatMessages(currentUserId.value, selectedChat?.value.applicationUserId),
  enabled: computed(() => !!selectedChat.value?.applicationUserId),
});

const { mutate, isPending } = useMutation({
  mutationFn: () => sendChatMessage(currentUserId.value, selectedChat.value?.applicationUserId, newMessage.value),
  onSuccess: () => {
    queryClient.setQueryData(
        ["doctor-chat", selectedChat.value?.applicationUserId],
        (oldMessages) => {
          const optimisticMessage = {
            senderId: currentUserId.value,
            message: newMessage.value,
            sentAt: new Date().toISOString()
          };
          return [...(oldMessages || []), optimisticMessage];
        }
    );
    newMessage.value = "";
  }
})

const filteredDoctors = computed(() => {
  if (!doctors.value) return [];
  if (!search.value) return doctors.value;

  const q = search.value.toLowerCase();
  return doctors.value.filter(
      d =>
          d.firstName?.toLowerCase().includes(q) ||
          d.lastName?.toLowerCase().includes(q) ||
          d.email?.toLowerCase().includes(q)
  );
});

watch(drChat, async () => {
  await nextTick();

  if (bottomMarker.value) {
    bottomMarker.value.scrollIntoView({ behavior: "smooth" });
  }
});
</script>

<template>
  <div class="container-fluid chat-page">
    <div class="row h-100">
      <div class="col-md-4 border-end chat-sidebar p-0">
        <div class="p-3 border-bottom">
          <span class="position-relative w-100">
            <Search class="position-absolute top-50 translate-middle-y ms-2 text-muted" />
            <InputText class="form-control ps-5" v-model="search" placeholder="Search" />
          </span>
        </div>
        <div class="chat-list overflow-auto">
          <Listbox
              v-model="selectedChat"
              :options="filteredDoctors || []"
              optionLabel="firstName"
              class="w-100 border-0 chat-list-box"
          >
            <template #option="slotProps">
              <div class="d-flex align-items-center justify-content-between w-100 test">
                <div class="d-flex align-items-center">
                  <Avatar
                      :image="slotProps.option.imageFilePath"
                      class="me-2"
                      size="large"
                      shape="circle"
                  />
                  <div>
                    <div class="fw-bold">
                      {{ slotProps.option.firstName }} {{ slotProps.option.lastName }}
                    </div>
                    <small class="text-muted">{{ slotProps.option.email }}</small>
                  </div>
                </div>
              </div>
            </template>
          </Listbox>
        </div>
      </div>

      <div class="col-md-8 d-flex flex-column p-0 chat-container">
        <div v-if="selectedChat">
          <div class="d-flex align-items-center justify-content-between border-bottom p-3">
            <div class="d-flex align-items-center">
                <Avatar
                    :image="selectedChat.imageFilePath"
                    class="me-3"
                    size="large"
                    shape="circle"
                />
              <div>
                <div class="fw-bold">
                  {{ selectedChat.firstName }} {{ selectedChat.lastName }}
                </div>
                <small class="text-muted">{{ selectedChat.email }}</small>
              </div>
            </div>
          </div>

          <ScrollPanel ref="chatScroll" class="flex-grow-1 p-3 overflow-auto chat-messages">
            <div v-if="isLoadingDrChat" class="text-center text-muted">Loading messages...</div>
            <div v-else-if="drChatError" class="text-center text-danger">Failed to load messages</div>
            <div v-else-if="!drChat || drChat.length === 0" class="text-center text-muted fs-5">
              No chat history with this doctor yet.
            </div>
            <div v-else>
              <div
                  v-for="(msg, index) in drChat || []"
                  :key="msg.id || index"
                  :class="['d-flex mb-3', isMine(msg.senderId) ? 'justify-content-end' : 'justify-content-start']"
              >
                <Avatar
                    v-if="!isMine(msg.senderId)"
                    :image="selectedChat.imageFilePath"
                    class="user-avatar me-2"
                    size="normal"
                    shape="circle"
                />

                <div
                    :class="[
                      'p-2 shadow-sm d-flex flex-column',
                      isMine(msg.senderId)
                      ? 'bg-success text-white my-message-container'
                      : 'receiver-message-container bg-light'
                    ]"
                    style="max-width: 70%;"
                >
                  <div>{{ msg.message }}</div>
                  <small
                      :class="[
                      'align-self-end',
                      isMine(msg.senderId) ? 'text-white' : 'text-muted'
                      ]"
                      style="font-size: 0.75rem;"
                  >
                    {{ moment.utc(msg.sentAt).local().format("HH:mm") }}
                  </small>
                </div>
                <Avatar
                    v-if="isMine(msg.senderId)"
                    :image="user?.profileImage"
                    class="user-avatar ms-2"
                    size="normal"
                    shape="circle"
                />
              </div>
              <div ref="bottomMarker"></div>
            </div>
          </ScrollPanel>

          <div class="border-top p-3 d-flex align-items-center chat-input">
            <InputText
                v-model="newMessage"
                class="form-control me-2"
                placeholder="Write your message..."
                @keyup.enter="mutate"
            />
            <Button @click="mutate" :disabled="isPending"><Send /></Button>
          </div>
        </div>
        <div v-else class="d-flex flex-column justify-content-center align-items-center h-100">
          <p class="text-center fs-2">Select a doctor to chat with</p>
          <Group width="100" height="100" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page, .chat-list, .chat-list-box, .chat-container {
  max-height: calc(97vh - (var(--header-height)));
}

.chat-sidebar {
  background-color: #f8f9fa;
  max-height: calc(97vh - (var(--header-height)));
}

:deep(.p-listbox-list-container) {
  max-height: 100% !important;
}

.chat-messages {
  max-height: calc(75vh - (var(--header-height)));
}

.chat-input {
  flex-shrink: 0;
  background: #fff;
}

.my-message-container {
  border-radius: 15px 0 15px 15px;
  word-wrap: break-word;
}

.receiver-message-container {
  border-radius: 0 15px 15px 15px;
  word-wrap: break-word;
}
</style>