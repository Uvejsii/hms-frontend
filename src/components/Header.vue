<script setup>
import UserDropdown from "@/components/home/UserDropdown.vue";
import { useUser } from "@/modules/auth/sdk/user.js";
import {useRouter} from "vue-router";

const router = useRouter()
const { user } = useUser()


const goToLogin = (router) => {
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <div class="page-title">
        <RouterLink to="/" class="text-decoration-none text-black">
          <img src="../assets/HMS-Logo.png" alt="hms-logo" class="hms-logo">
        </RouterLink>
      </div>
    </div>

    <div class="topbar-right" v-if="user?.id">
      <div class="topbar-actions">
        <div class="user-profile">
          <UserDropdown />
        </div>
      </div>
    </div>
    <Button
        v-else
        @click="goToLogin(router)"
        label="Login or Register"
    />
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
  height: var(--header-height);
  z-index: 1000;
}

.topbar-left {
  display: flex;
  align-items: center;
}

.hms-logo {
  height: 40px;
}

.menu-button {
  margin-right: var(--spacing-md);
  font-size: 1.25rem;
}

.page-title h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: var(--font-weight-semibold);
}

.topbar-right {
  display: flex;
  align-items: center;
}

.search-container {
  margin-right: var(--spacing-md);
}

.search-input {
  background-color: var(--surface-ground);
  border-radius: 20px;
  width: 250px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.notification-button {
  font-size: 1.25rem;
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius);
  transition: background-color var(--transition-speed);
}

.user-profile:hover {
  background-color: var(--surface-ground);
}

.user-avatar {
  background-color: var(--primary-color);
  color: white;
}

.user-info {
  margin: 0 var(--spacing-sm);
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: var(--font-weight-semibold);
  font-size: 0.875rem;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.user-dropdown-icon {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* Notifications Dialog Styling */
.notifications-container {
  padding: var(--spacing-sm) 0;
}

.notification-item {
  display: flex;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--surface-border);
  transition: background-color var(--transition-speed);
}

.notification-item:hover {
  background-color: var(--surface-ground);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.notification-icon.appointment {
  background-color: rgba(0, 136, 204, 0.15);
  color: var(--primary-color);
}

.notification-icon.alert {
  background-color: rgba(245, 158, 11, 0.15);
  color: var(--warning-color);
}

.notification-icon.message {
  background-color: rgba(32, 201, 151, 0.15);
  color: var(--secondary-color);
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: var(--font-weight-semibold);
  margin-bottom: 4px;
}

.notification-message {
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.notification-actions {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-top: 1px solid var(--surface-border);
  margin-top: var(--spacing-sm);
}

@media (max-width: 768px) {
  .search-input {
    width: 150px;
  }

  .page-title h1 {
    font-size: 1.25rem;
  }
}

@media (max-width: 576px) {
  .search-container {
    display: none;
  }
}
</style>