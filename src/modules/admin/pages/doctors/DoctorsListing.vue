<script setup>
import { Plus, Search } from "@iconoir/vue";
import {inject, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import { useHospitalStore } from "@/stores/hospital.js";

const hospitalStore = useHospitalStore();
const router = useRouter();
const route = useRoute();
const activeTab = ref(route.name);

const items = ref([
  { route: 'doctors-active', label: 'Active Doctors' },
  { route: 'doctors-inactive', label: 'Inactive Doctors' },
]);

const changeTab = (e) => {
  router.push({ name: e });
};

const showAddDoctorPopup = inject('showAddDoctorPopup')
const openAddDoctorPopup = () => {
  showAddDoctorPopup();
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-between">
      <Tabs
          v-model:value="activeTab"
          class="active-inactive__tabs"
          @update:value="(e) => changeTab(e)"
      >
        <TabList>
          <Tab v-for="tab in items" :key="tab.label" :value="tab.route">
            <router-link v-if="tab.route" :to="{ name: tab.route }" class="text-black" active-class="tab-active">
              {{ tab.label }}
            </router-link>
          </Tab>
        </TabList>
      </Tabs>
      <div>
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputText
              v-model="hospitalStore.doctorSearchTerm"
              type="text"
              class="doctor-search-input"
              placeholder="Search by name or email"
          />
        </InputGroup>
      </div>
      <div class="text-end mb-2">
        <Button @click="openAddDoctorPopup">
          <Plus/> Add Doctor
        </Button>
      </div>
    </div>
    <div>
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.active-inactive__tabs {
  margin-bottom: 16px;
}

.tab-active {
  color: var(--secondary-dark) !important;
}
</style>