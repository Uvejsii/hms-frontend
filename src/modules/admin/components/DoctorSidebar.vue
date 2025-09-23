<script setup>
import { GraphUp, Community, Calendar, Airplane, ChatBubbleEmpty } from '@iconoir/vue'
import { useToast } from "primevue/usetoast";
import * as signalR from "@microsoft/signalr";
import { onMounted } from "vue";
import { useUser } from '@/modules/auth/sdk/user.js';

const { user } = useUser();
const toast = useToast();
let connection;

const routes = [
  { name: 'Dashboard', path: '/doctor/doctor-dashboard', icon: GraphUp },
  { name: 'Appointments', path: '/doctor/doctor-appointments', icon: Calendar },
  { name: 'Patients', path: '/doctor/doctor-patients', icon: Community },
  { name: 'Vacations', path: '/doctor/doctor-vacations', icon: Airplane },
  { name: 'Chat', path: '/doctor/doctor-chat-hub', icon: ChatBubbleEmpty },
]

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
    if (receiverId === user.value?.id) {
      toast.add({severity:'info', summary: 'New Message', detail: message, life: 8000});
    }
  });
});
</script>

<template>
  <div class="admin-sidebar">
    <nav>
      <ul class="sidebar-list">
        <li v-for="route in routes" :key="route.path">
          <router-link :to="route.path" class="sidebar-link" active-class="active">
            <component :is="route.icon" class="sidebar-icon" />
            <span>{{ route.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.admin-sidebar {
  position: fixed;
  top: 0;
  height: 100%;
  min-width: var(--admin-sidebar-width);
  background-color: var(--secondary-color, #2c3e50);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  color: #fff;
  padding: 12px 8px;
  border-radius: 8px;
  text-decoration: none;
  margin-bottom: 8px;
  transition: background 0.2s;
  font-size: 1.05rem;
  font-weight: 500;
}

.sidebar-link:hover,
.sidebar-link.active {
  background: #fff;
  color: var(--secondary-color, #2c3e50);
}

.sidebar-icon {
  font-size: 1.3rem;
  margin-right: 12px;
}
</style>