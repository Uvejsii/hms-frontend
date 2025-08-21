<script setup>
import {getAllPatients} from "@/modules/admin/sdk/api.js";
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import {inject} from "vue";
import { Plus, Restart, Eye } from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";

const queryKey = ['patients'];

const { data: patients, isLoading: IsPatientsLoading, isError: isPatientsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getAllPatients(),
});

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
  <div class="text-end mb-3">
    <Button @click="openAddPatientPopup"><Plus /> Register Patient</Button>
  </div>
  <DataTable
      :value="patients"
      rowHover
      @row-click="openPatientAppointmentsSidebarPopup($event.data)">
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