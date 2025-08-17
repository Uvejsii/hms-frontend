<script setup>
import { HomeHospital, PharmacyCrossTag, Community, Calendar, Settings } from '@iconoir/vue'

const routes = [
  { name: 'Dashboard', path: '/admin/admin-dashboard', icon: HomeHospital },
  { name: 'Doctors', path: '/admin/doctors-management', icon: PharmacyCrossTag },
  { name: 'Departments', path: '/admin/departments-management', icon: HomeHospital },
]
</script>

<template>
  <div class="admin-sidebar">
    <h2 class="sidebar-title">Admin Panel</h2>
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
  box-shadow: 2px 0 8px rgba(0,0,0,0.05);
}

.sidebar-title {
  color: #fff;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 32px;
  letter-spacing: 1px;
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