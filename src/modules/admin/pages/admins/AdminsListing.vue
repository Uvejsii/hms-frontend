<script setup>
import {getAllAdmins} from "@/modules/admin/sdk/api.js";
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import {computed, inject} from "vue";
import {Plus, Restart, Calendar, Search} from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import { useHospitalStore } from "@/stores/hospital.js";

const hospitalStore = useHospitalStore();

const queryKey = ['admins'];

const { data: admins, isLoading: IsAdminsLoading, isError: isAdminsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getAllAdmins(),
});

const filteredPatients = computed(() => {
  if (!admins?.value) return []
  const term = hospitalStore.adminSearchTerm.toLowerCase()
  return admins.value.filter(p =>
      p.firstName?.toLowerCase().includes(term) ||
      p.lastName?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
  )
})

const showPatientAppointmentsSidebarPopup = inject('showPatientAppointmentsSidebarPopup')
const openPatientAppointmentsSidebarPopup = (data) => {
  showPatientAppointmentsSidebarPopup(data);
}

const showResetPasswordPopup = inject('showResetPasswordPopup')
const openResetPasswordPopup = (data) => {
  showResetPasswordPopup({...data });
}

const showAddAdminPopup = inject('showAddAdminPopup')
const openAddAdminPopup = () => {
  showAddAdminPopup();
}
</script>

<template>
  <div class="d-flex justify-content-between mb-3">
    <div>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputText
            v-model="hospitalStore.adminSearchTerm"
            type="text"
            class="patient-search-input"
            placeholder="Search by name or email"
        />
      </InputGroup>
    </div>
    <div>
      <Button @click="openAddAdminPopup"><Plus /> Register Admin</Button>
    </div>
  </div>
  <DataTable
      :value="filteredPatients"
      :paginator="true"
      :rows="hospitalStore.itemsPerPage"
      :totalRecords="filteredPatients.length"
      :first="hospitalStore.currentPage"
      @page="hospitalStore.onPage"
  >
    <Column header="No.">
      <template #body="{ index }">
        <span>{{ filteredPatients.length - (hospitalStore.currentPage + index) }}.</span>
      </template>>
    </Column>
    <Column header="Email" field="email" />
    <Column header="First name" field="firstName" />
    <Column header="Last name" field="lastName" />
    <Column header="Actions">
      <template #body="{ data }">
        <ActionMenu>
          <ActionMenuItem @click="openResetPasswordPopup(data)">
            <Restart /> Reset Password
          </ActionMenuItem>
          <ActionMenuItem @click="openPatientAppointmentsSidebarPopup(data)">
            <Calendar /> Appointments
          </ActionMenuItem>
        </ActionMenu>
      </template>
    </Column>
    <template #empty>
      <TableSkeleton rows="10" columns="7" v-if="IsAdminsLoading" />
      <p v-if="isAdminsError">Something went wrong, please try again.</p>
      <template v-if="!IsAdminsLoading && !isAdminsError">
        <p class="text-center m-0">
          No admins found.
        </p>
      </template>
    </template>
  </DataTable>
</template>

<style scoped>
</style>