<script setup>
import ActionMenu from "@/components/ActionMenu.vue";
import {LogOut, Calendar, EditPencil} from "@iconoir/vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import { useUser } from "@/modules/auth/sdk/user.js";
import {useRouter} from "vue-router";
import { inject } from "vue";

const router = useRouter();
const { user, logout } = useUser()

const goToAppointments = () => {
  router.push({ name: 'patient-appointments' })
}

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
            class="user-avatar"
            size="normal"
            shape="circle"
            :label="user ? user?.firstName[0] + user?.lastName[0] : ''"
        />
        <span class="user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
      </div>
    </template>
<!--    <ActionMenuItem as="router-link" :to="{ name: 'profile' }">-->
<!--      <User height="20" /> My Profile-->
<!--    </ActionMenuItem>-->
    <ActionMenuItem @click="goToAppointments()">
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