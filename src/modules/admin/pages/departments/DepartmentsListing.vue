<script setup>
import {inject, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import { Plus } from "@iconoir/vue";

const router = useRouter();
const route = useRoute();
const activeTab = ref(route.name);

const items = ref([
  { route: 'departments-active', label: 'Active departments' },
  { route: 'departments-inactive', label: 'Inactive departments' },
]);

const changeTab = (e) => {
  router.push({ name: e });
};

const showAddDepartmentPopup = inject('showAddDepartmentPopup')
const openAddDepartmentPopup = () => {
  showAddDepartmentPopup();
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
      <div class="text-end mb-2">
        <Button @click="openAddDepartmentPopup">
          <Plus/> Add Department
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