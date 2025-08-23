<script setup>
import {getAllPatients} from "@/modules/admin/sdk/api.js";
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import {computed, inject} from "vue";
import {Plus, Restart, Eye, Search} from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import { useHospitalStore } from "@/stores/hospital.js";

const hospitalStore = useHospitalStore();

const queryKey = ['patients'];

const { data: patients, isLoading: IsPatientsLoading, isError: isPatientsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getAllPatients(),
});

const filteredPatients = computed(() => {
  if (!patients?.value) return []
  const term = hospitalStore.patientSearchTerm.toLowerCase()
  return patients.value.filter(p =>
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

const showAddPatientPopup = inject('showAddPatientPopup')
const openAddPatientPopup = () => {
  showAddPatientPopup();
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
            v-model="hospitalStore.patientSearchTerm"
            type="text"
            class="patient-search-input"
            placeholder="Search by name or email"
        />
      </InputGroup>
    </div>
    <div>
      <Button @click="openAddPatientPopup"><Plus /> Register Patient</Button>
    </div>
  </div>
  <DataTable
      :value="filteredPatients"
      rowHover
      @row-click="openPatientAppointmentsSidebarPopup($event.data)"
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
            <Eye /> View Appointments
          </ActionMenuItem>
        </ActionMenu>
      </template>
    </Column>
    <template #empty>
      <TableSkeleton rows="10" columns="7" v-if="IsPatientsLoading" />
      <p v-if="isPatientsError">Something went wrong, please try again.</p>
      <template v-if="!IsPatientsLoading && !isPatientsError">
        <p class="text-center m-0">
          No patients found.
        </p>
      </template>
    </template>
  </DataTable>
</template>

<style scoped>
.p-datatable >>> .p-datatable-tbody > tr:hover {
  cursor: pointer;
}
</style>