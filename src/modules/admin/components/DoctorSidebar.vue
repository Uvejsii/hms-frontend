<script setup>
import { GraphUp, Community, Calendar, Airplane } from '@iconoir/vue'

const routes = [
  { name: 'Dashboard', path: '/doctor/doctor-dashboard', icon: GraphUp },
  { name: 'Appointments', path: '/doctor/doctor-appointments', icon: Calendar },
  { name: 'Patients', path: '/doctor/doctor-patients', icon: Community },
  { name: 'Vacations', path: '/doctor/doctor-vacations', icon: Airplane },
]
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