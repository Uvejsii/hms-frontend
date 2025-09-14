<script setup>
import ActionMenu from "@/components/ActionMenu.vue";
import {LogOut, Calendar, EditPencil} from "@iconoir/vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import { useUser } from "@/modules/auth/sdk/user.js";
import {useRouter} from "vue-router";
import {computed, inject} from "vue";

const router = useRouter();
const { user, logout, userRole } = useUser()

const goToAppointments = () => {
  router.push({ name: 'patient-appointments' })
}

const showAvatarLabel = computed(() => {
  if (user.value && (userRole.value !== 'Doctor' || !user.value.profileImage)) {
    return user?.value.firstName[0] + user?.value.lastName[0]
  }
  return '';
})

const showChangePasswordPopup = inject("showChangePasswordPopup");
const openChangePassword = () => {
  showChangePasswordPopup();
}
</script>

<template>
  <ActionMenu>
    <template #trigger>
      <div class="user-details">
        <Avatar
            :image="user && userRole === 'Doctor' && user.profileImage ? user.profileImage : null"
            class="user-avatar"
            size="normal"
            shape="circle"
            :label="showAvatarLabel"
        />
        <span class="user-name">
          {{userRole === 'Doctor' ? 'Dr. ' : null }} {{ user?.firstName }} {{ user?.lastName }}
        </span>
      </div>
    </template>
    <ActionMenuItem v-if="userRole !== 'Doctor'" @click="goToAppointments()">
      <Calendar /> Appointments
    </ActionMenuItem>
    <ActionMenuItem @click="openChangePassword()">
      <EditPencil /> Change Password
    </ActionMenuItem>
    <ActionMenuItem severity="danger" @click="logout(router)">
      <LogOut /> Logout
    </ActionMenuItem>
  </ActionMenu>
</template>

<style scoped>
.user-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  background-color: var(--primary-color);
  color: white;
}
</style>