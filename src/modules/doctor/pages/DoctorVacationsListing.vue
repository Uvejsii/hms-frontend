<script setup>
import {inject, ref} from 'vue';
import Card from 'primevue/card';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import {useQuery} from "@tanstack/vue-query";
import {getTotalVacationRequestsByDrId} from "@/modules/doctor/sdk/api.js";
import { useUser } from '@/modules/auth/sdk/user.js';
import {formatDate, getVacationTypeLabel} from "@/utils/helpers.js";
import TableSkeleton from "@/components/TableSkeleton.vue";
import {Check, Hourglass, Xmark} from "@iconoir/vue";

const { user } = useUser();

const { data, isLoading, isError } = useQuery({
  queryKey: ['total-vacation', Number(user.value.doctorId)],
  queryFn: () => getTotalVacationRequestsByDrId(Number(user.value.doctorId)),
  refetchOnWindowFocus: true,
})

const getRowsForType = (type) => {
  const stat = data.value?.vacationTypeStats.find(v => v.vacationType === type)
  if (!stat) return []
  return [
    ...stat.approved.map(item => ({ ...item, status: 'Approved' })),
    ...stat.pending.map(item => ({ ...item, status: 'Pending' })),
    ...stat.rejected.map(item => ({ ...item, status: 'Rejected' })),
  ]
}

const getVacationColor = (type) => {
  switch (type) {
    case 0:
      return 'bg-primary';
    case 1:
      return 'bg-success';
    case 2:
      return 'bg-warning';
    default:
      return 'bg-secondary';
  }
}

const getVacationIcon = (type) => {
  switch (type) {
    case 0:
      return 'iconoir-sun-light';
    case 1:
      return 'iconoir-bed-ready';
    case 2:
      return 'iconoir-bank';
    default:
      return 'iconoir-question-mark';
  }
}

const getVacationComponentColor = (type) => {
  switch (type) {
    case 0:
      return 'info';
    case 1:
      return 'success';
    case 2:
      return 'warn';
    default:
      return 'secondary';
  }
};

const getStatusTagColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'success'
    case 'Pending':
      return 'warn'
    case 'Rejected':
      return 'danger'
    default:
      return 'secondary'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved':
      return Check
    case 'Pending':
      return Hourglass
    case 'Rejected':
      return Xmark
    default:
      return null
  }
}

const getProgressBarValue = (daysLeft, totalDays) => {
  return (daysLeft / totalDays) * 100;
};

const showRequestVacationPopup = inject('showRequestVacationPopup')
const openRequestVacation = (data) => {
  showRequestVacationPopup({...data});
}
</script>

<template>
  <div class="container-fluid d-flex flex-column align-items-center justify-content-center">
    <div class="row w-100 justify-content-center g-4">
      <TableSkeleton v-if="isLoading || isError" rows="9" columns="3" />
      <div v-else v-for="vacation in data?.vacationTypeStats" class="col-12 col-sm-6 col-lg-4">
        <Card class="vacation-card shadow-lg h-100 border-0 rounded-4">
          <template #header>
            <div :class="[getVacationColor(vacation.vacationType),
            'card-header', 'text-white', 'd-flex', 'align-items-center', 'justify-content-center', 'py-3']">
              <i :class="['vacation-icon', getVacationIcon(vacation.vacationType)]"></i>
            </div>
          </template>
          <template #title>
            <div class="text-center fw-bold text-dark">
              {{ getVacationTypeLabel(vacation.vacationType) }}
            </div>
          </template>
          <template #subtitle>
            <div class="text-center text-muted">
              Your remaining days
            </div>
          </template>
          <template #content>
            <div class="d-flex flex-column align-items-center p-1">
              <div class="mb-4">
                <Tag
                    :value="`${vacation.approvedRequestedDays} / ${vacation.vacationType !== 2 ? 20 : '&infin;'}`"
                    :severity="getVacationComponentColor(vacation.vacationType)"
                    class="fs-6 fw-bold px-4 py-1 rounded-pill shadow-sm" />
              </div>
              <div class="w-100">
                <ProgressBar :value="getProgressBarValue(vacation.approvedRequestedDays, 20)"
                             :showValue="false" class="h-1rem" />
              </div>
            </div>
            <div class="mt-4 w-100">
              <Button
                  :label="'Request Leave'"
                  :severity="getVacationComponentColor(vacation.vacationType)"
                  rounded class="w-100"
                  @click="openRequestVacation(vacation)"
              />
            </div>
          </template>
        </Card>
      </div>
    </div>
    <div class="row w-100 my-5">
      <div v-for="type in [0,1,2]" :key="type" class="my-2">
        <h3>{{ getVacationTypeLabel[type] }}</h3>

        <DataTable :value="getRowsForType(type)" class="border p-0">
          <Column header="Vacation Type">
            <template #body="{ data }">
              <Tag :value="getVacationTypeLabel(data.vacationType)"
                   :severity="getVacationComponentColor(data.vacationType)"
                   class="text-capitalize" />
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <Tag :severity="getStatusTagColor(data.status)" class="d-inline-flex align-items-center gap-2 px-3 py-2">
                <template #default>
                  <component :is="getStatusIcon(data.status)" style="font-size: 1rem;" />
                  {{ data.status }}
                </template>
              </Tag>
            </template>
          </Column>
          <Column field="startDate" header="Start Date">
            <template #body="{ data }">
              {{ formatDate(data.startDate) }}
            </template>
          </Column>
          <Column field="endDate" header="End Date">
            <template #body="{ data }">
              {{ formatDate(data.endDate) }}
            </template>
          </Column>
          <Column field="requestedDays" header="Days Requested" />

          <template #empty>
            <TableSkeleton rows="10" columns="7" v-if="isLoading" />
            <p v-if="isError">Something went wrong, please try again.</p>
            <template v-if="!isLoading && !isError">
              <p class="text-center m-0">
                No vacation requests found.
              </p>
            </template>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
@import "https://cdn.jsdelivr.net/npm/iconoir@6.1.1/css/iconoir.min.css";

.vacation-card {
  border-radius: 1rem !important;
}

.card-header {
  border-top-left-radius: 1rem !important;
  border-top-right-radius: 1rem !important;
}

.vacation-icon {
  font-size: 2.5rem;
}

.p-progressbar {
  height: 0.75rem;
  border-radius: 0.5rem;
}
</style>
