<script setup>
import { computed, ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {getAppointmentsForPatient} from "@/modules/admin/sdk/api.js";
import TableSkeleton from "@/components/TableSkeleton.vue";
import {formatDateTo24Hour, formatDateWithHour, getStatusLabel} from "@/utils/helpers.js";

const emit = defineEmits(['close'])
const props = defineProps(['data'])
const visible = ref(true)

const appointmentsByUserKey = computed(() => ['appointments', props.data.id])
const { data, isLoading } = useQuery({
  queryKey: appointmentsByUserKey,
  queryFn: () => getAppointmentsForPatient(props.data.id)
})

const cancel = () => {
  emit('close', null)
}
</script>

<template>
  <Drawer
      v-model:visible="visible"
      @hide="cancel"
      style="max-width: 1098px; width: 100%"
      :header="`${props.data.firstName} ${props.data.lastName}'s appointments`"
      position="right"
  >
    <div class="patient-appointments-table">
      <DataTable
          style="table-layout: fixed"
          :value="data"
      >
        <Column field="" header="Doctor">
          <template #body="{ data }">
            <span>Dr. {{ data.doctor.firstName + ' ' + data.doctor.lastName }}</span>
          </template>
        </Column>
        <Column field="" header="Date">
          <template #body="{ data }">
            <span class="appointment-date">{{ formatDateWithHour(data.startTime) + '-' + formatDateTo24Hour(data.endTime) }}</span>
          </template>
        </Column>
        <Column field="notes" header="Notes">
          <template #body="{ data }">
            <span class="notes-ellipsis" v-tooltip.top="data.notes">{{ data.notes || 'No notes provided' }}</span>
          </template>
        </Column>
        <Column field="price" header="Price">
          <template #body="{ data }">
            <span>{{ data.price.toFixed(2) }} &euro;</span>
          </template>
        </Column>
        <Column field="contactPhoneNumber" header="Phone number" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span>{{ getStatusLabel(data.status) }}</span>
          </template>
        </Column>
        <template #empty>
          <TableSkeleton rows="3" columns="5" v-if="isLoading" />

          <template v-else>
            <p>No appointments found</p>
          </template>
        </template>
      </DataTable>
    </div>
  </Drawer>
</template>

<style scoped>
.appointment-date {
  font-size: 13px;
}

.notes-ellipsis {
  display: inline-block;
  max-width: 145px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>
