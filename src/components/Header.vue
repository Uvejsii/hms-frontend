<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Bell, MessageText, Calendar, WarningTriangle } from '@iconoir/vue'
import UserDropdown from "@/components/home/UserDropdown.vue";

// References
const userMenu = ref(null)

// State
const userMenuVisible = ref(false)
const showNotifications = ref(false)

// Menu items
const userMenuItems = [
  {
    label: 'My Profile',
    icon: 'pi pi-user',
    command: () => {
      // Navigate to profile page
    }
  },
  {
    label: 'Account Settings',
    icon: 'pi pi-cog',
    command: () => {
      // Navigate to settings page
    }
  },
  {
    separator: true
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      window.location.href = '/login'
    }
  }
]

// Sample notifications data
const notifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'New Appointment',
    message: 'Patient John Doe scheduled for 2:00 PM today',
    time: '15 minutes ago'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Lab Results',
    message: 'Lab results for patient Sarah Smith are ready',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'message',
    title: 'New Message',
    message: 'Dr. Rodriguez: Can we discuss the treatment plan?',
    time: '3 hours ago'
  }
]


const notificationIcon = (type) => {
 switch (type) {
   case 'appointment': return Calendar
   case 'alert': return WarningTriangle
   case 'message': return MessageText
   default: return Bell
 }
}

// Show/hide user menu
watch(userMenuVisible, (value) => {
  if (value) {
    nextTick(() => {
      toggleUserMenu(event)
    })
  }
})

// Add click outside listener
const handleClickOutside = (event) => {
  if (userMenuVisible.value && !event.target.closest('.user-profile') && !event.target.closest('.p-menu')) {
    userMenuVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="topbar">
    <div class="topbar-left">
      <div class="page-title">
        <h1><RouterLink to="/" class="text-decoration-none text-black">Find doctors</RouterLink></h1>
      </div>
    </div>

    <div class="topbar-right">
      <div class="topbar-actions">
        <span v-tooltip.bottom="'Notifications'">
          <Bell height="20" @click="showNotifications = true" class="cursor-pointer"/>
        </span>

        <div class="user-profile">
          <UserDropdown />
        </div>
      </div>
    </div>

    <!-- Notifications Overlay -->
    <Dialog v-model:visible="showNotifications" header="Notifications" modal style="width: 30rem">
      <div class="notifications-container">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
          <div class="notification-icon" :class="notification.type">
            <component :is="notificationIcon(notification.type)" :height="20" />
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ notification.time }}</div>
          </div>
        </div>

        <div class="notification-actions">
          <Button label="Mark all as read" text class="p-button-text" />
          <Button label="View all" text class="p-button-text" />
        </div>
      </div>
    </Dialog>
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
  height: 64px;
  z-index: 1000;
}

.topbar-left {
  display: flex;
  align-items: center;
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