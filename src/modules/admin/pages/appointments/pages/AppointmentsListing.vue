<script setup>
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import {Download} from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import { useHospitalStore } from "@/stores/hospital.js";
import {getAllAppointments} from "@/modules/admin/pages/appointments/sdk/api.js";
import {
  formatDateTo24Hour,
  formatDateWithHour,
  generateInvoice,
  generatePrescription,
  getStatusLabel
} from "@/utils/helpers.js";

const hospitalStore = useHospitalStore();

const queryKey = ['appointments'];

const { data: appointments, isLoading: IsAppointmentsLoading, isError: isAppointmentsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getAllAppointments(),
});
</script>

<template>
  <DataTable
      :value="appointments"
      :paginator="true"
      :rows="hospitalStore.itemsPerPage"
      :first="hospitalStore.currentPage"
      @page="hospitalStore.onPage"
  >
    <Column header="No.">
      <template #body="{ index }">
        <span>{{ appointments.length - (hospitalStore.currentPage + index) }}.</span>
      </template>
    </Column>
    <Column header="Patient">
      <template #body="{ data }">
        <span>{{ data.user.firstName + ' ' + data.user.lastName }}</span>
      </template>
    </Column>
    <Column header="Doctor">
      <template #body="{ data }">
        <span>Dr. {{ data.doctor.firstName + ' ' + data.doctor.lastName }}</span>
      </template>
    </Column>
    <Column header="Date">
      <template #body="{ data }">
        <span class="appointment-date">{{ formatDateWithHour(data.startTime) + '-' + formatDateTo24Hour(data.endTime) }}</span>
      </template>
    </Column>
    <Column field="notes" header="Notes">
      <template #body="{ data }">
        <span class="notes-ellipsis" v-tooltip.top="data.notes">{{ data.notes || 'No notes provided' }}</span>
      </template>
    </Column>
    <Column header="status">
      <template #body="{ data }">
        <span>{{ getStatusLabel(data.status) }}</span>
      </template>
    </Column>
    <Column header="Price">
      <template #body="{ data }">
        <span>{{ data.price.toFixed(2) }} &euro;</span>
      </template>
    </Column>
    <Column header="Actions">
      <template #body="{ data }">
        <ActionMenu>
          <ActionMenuItem @click="generateInvoice(data)">
            <Download /> Download Invoice
          </ActionMenuItem>
          <ActionMenuItem @click="generatePrescription(data)">
            <Download /> Download Prescription
          </ActionMenuItem>
        </ActionMenu>
      </template>
    </Column>
    <template #empty>
      <TableSkeleton rows="10" columns="7" v-if="IsAppointmentsLoading" />
      <p v-if="isAppointmentsError">Something went wrong, please try again.</p>
      <template v-if="!IsAppointmentsLoading && !isAppointmentsError">
        <p class="text-center m-0">
          No patients found.
        </p>
      </template>
    </template>
  </DataTable>
</template>

<style scoped>
.notes-ellipsis {
  display: inline-block;
  max-width: 145px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>