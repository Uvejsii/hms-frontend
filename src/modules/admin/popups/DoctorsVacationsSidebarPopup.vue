<script setup>
import { computed, ref, inject } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {getVacationRequestsForDoctor} from "@/modules/admin/sdk/api.js";
import TableSkeleton from "@/components/TableSkeleton.vue";
import { formatDate, getVacationTypeLabel } from "@/utils/helpers.js";
import {Check, Xmark, EditPencil, Hourglass} from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";

const emit = defineEmits(['close'])
const props = defineProps(['data'])
const visible = ref(true)

const vacationsRequestsByDoctorKey = computed(() => ['doctor-vacations-requests', props.data.id])
const { data, isLoading } = useQuery({
  queryKey: vacationsRequestsByDoctorKey,
  queryFn: () => getVacationRequestsForDoctor(props.data.id)
})

const cancel = () => {
  emit('close', null)
}

const showUpdateVacationStatusPopup = inject('showUpdateVacationStatusPopup')
const openUpdateVacationStatusPopup = (data) => {
  showUpdateVacationStatusPopup({...data, revalidateKey: vacationsRequestsByDoctorKey.value });
}
</script>

<template>
  <Drawer
      v-model:visible="visible"
      @hide="cancel"
      style="max-width: 1098px; width: 100%"
      :header="`Dr. ${props.data.firstName} ${props.data.lastName}'s vacation requests`"
      position="right"
  >
    <div class="patient-appointments-table">
      <DataTable
          style="table-layout: fixed"
          :value="data"
      >
        <Column field="vacationType" header="Vacation Type">
          <template #body="{ data }">
            <span>{{ getVacationTypeLabel(data.vacationType) }}</span>
          </template>
        </Column>
        <Column field="startDate" header="Start date">
          <template #body="{ data }">
            <span>{{ formatDate(data.startDate) }}</span>
          </template>
        </Column>
        <Column field="endDate" header="End date">
          <template #body="{ data }">
            <span>{{ formatDate(data.endDate) }}</span>
          </template>
        </Column>
        <Column field="isApproved" header="Approved">
          <template #body="{ data }">
            <Tag :severity="data?.isApproved ? 'Yes' : (data.isApproved == null ? 'warn' : 'danger')">
              <span v-if="data?.isApproved" class="d-flex gap-2 align-items-center">
                <Check /> Yes
              </span>
              <span v-else-if="data.isApproved == null" class="d-flex gap-2 align-items-center">
                <Hourglass class="mr-2" /> Pending
              </span>
              <span v-else class="d-flex gap-2 align-items-center">
                <Xmark class="mr-2" /> No
              </span>
            </Tag>
          </template>
        </Column>
        <Column field="" header="Actions">
          <template #body="{ data }">
            <ActionMenu>
              <ActionMenuItem @click="openUpdateVacationStatusPopup(data)">
                <EditPencil /> Edit Status
              </ActionMenuItem>
            </ActionMenu>
          </template>
        </Column>
        <template #empty>
          <TableSkeleton rows="3" columns="5" v-if="isLoading" />
          <template v-else>
            <p class="text-center m-2">No vacation requests found</p>
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
