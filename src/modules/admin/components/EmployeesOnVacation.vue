<script setup>
import TableSkeleton from "@/components/TableSkeleton.vue";
import {useQuery} from "@tanstack/vue-query";
import {getAllApprovedVacationRequests} from "@/modules/admin/sdk/api.js";
import {formatDate, getVacationTypeLabel} from "@/utils/helpers.js";
import moment from "moment";

const today = moment().startOf("day")

const { data, isLoading, isError } = useQuery({
  queryKey: ['employees-on-vacation'],
  queryFn: () => getAllApprovedVacationRequests(),
  select: (data) => {
    return data.filter(vacation => {
      const endDate = moment(vacation.endDate)
      return endDate.isSameOrAfter(today, 'day')
    })
  }
})
</script>

<template>
  <div class="admin-dashboard-chart-large">
    <div class="admin-dashboard-chart-title">
      <p>Employees on vacation</p>
    </div>
    <div>
      <div>
        <DataTable :value="data" paginator :rows="3">
          <Column field="" header="Doctor" style="width: 30%">
            <template #body="{ data }">
              <div class="doctor-wrapper">
                <Image :src="data.doctor.imageFilePath"  imageClass="doctor-image" preview alt="Doctor Image" />
                <span class="table-text">Dr. {{ data.doctor.firstName }} {{ data.doctor.lastName }}</span>
              </div>
            </template>
          </Column>
          <Column header="Department" style="width: 25%">
            <template #body="{ data }">
              <span class="table-text">{{ data.doctor.departament.name }}</span>
            </template>
          </Column>
          <Column header="Date" style="width: 25%">
            <template #body="{ data }">
              <span class="table-text">{{ formatDate(data.startDate) }} - {{ formatDate(data.endDate) }}</span>
            </template>
          </Column>
          <Column header="Type" style="width: 25%">
            <template #body="{ data }">
              <span class="table-text">{{ getVacationTypeLabel(data.vacationType) }}</span>
            </template>
          </Column>
          <template #empty>
            <TableSkeleton rows="10" columns="7" v-if="isLoading" />
            <p v-if="isError">Something went wrong, please try again.</p>
            <template v-if="!isLoading && !isError">
              <p class="text-center m-0">
                No employees on vacation.
              </p>
            </template>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard-chart-large {
  height: 100%;
}

.table-text {
  font-size: 13px;
}

.doctor-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

::v-deep(.doctor-image) {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}
</style>