<script setup>
import {RouterView, useRoute} from 'vue-router'
import {Toast} from "primevue";
import Popups from "@/components/popups/Popups.vue";
import {VueQueryDevtools} from "@tanstack/vue-query-devtools";
import { IconoirProvider } from '@iconoir/vue'
import Header from "@/components/Header.vue";
import {useUser} from "@/modules/auth/sdk/user.js";
import AdminSideBar from "@/components/AdminSideBar.vue";
import DoctorSidebar from "@/modules/admin/components/DoctorSidebar.vue";
import Footer from "@/components/Footer.vue";

const route = useRoute();
const { userRole } = useUser();
</script>

<template>
  <IconoirProvider :icon-props="{ width: 20 }">
    <Popups>
      <VueQueryDevtools />
      <Toast/>
      <Header :class="{'hms-header': userRole === 'Admin' || userRole === 'Doctor'}" />
      <div class="d-flex mx-2 my-3">
        <AdminSideBar v-if="userRole === 'Admin'" />
        <DoctorSidebar v-if="userRole === 'Doctor'" />
        <div
            class="container-fluid"
            :class="{'main-content': userRole === 'Admin' || userRole === 'Doctor'}"
        >
          <RouterView />
        </div>
      </div>
      <Footer v-if="route.path === '/'" />
    </Popups>
  </IconoirProvider>
</template>

<style scoped>
.hms-header {
  margin-left: var(--admin-sidebar-width);
}

.main-content {
  margin-left: var(--admin-sidebar-width);
}
</style>
