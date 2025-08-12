<script setup>
import {
  getTotalAppointments,
  getTotalDepartments,
  getTotalDoctors, getTotalPatients,
} from "@/modules/admin/sdk/api.js";
import { computed } from 'vue'
import {useQuery} from "@tanstack/vue-query";
import { PharmacyCrossTag, HomeHospital, Community, Calendar } from "@iconoir/vue";
import DoctorsAvailabilityChart from "@/modules/admin/components/DoctorsAvailabilityChart.vue";
import DoctorsToDepartmentsChart from "@/modules/admin/components/DoctorsToDepartmentsChart.vue";
import StatsCard from "@/modules/admin/components/StatsCard.vue";
import TableSkeleton from "@/components/TableSkeleton.vue";
import BookingStatsOverview from "@/modules/admin/components/BookingStatsOverview.vue";
import MonthlyAppointmentTotalsChart from "@/modules/admin/components/MonthlyAppointmentTotalsChart.vue";
import EmployeesOnVacation from "@/modules/admin/components/EmployeesOnVacation.vue";

const { data: doctorsCount, isLoading: isDoctorsCountLoading } = useQuery({
  queryKey: ['doctors-count'],
  queryFn: () => getTotalDoctors(),
});

const { data: departmentsCount, isLoading: isDepartmentsCountLoading } = useQuery({
  queryKey: ['departments-count'],
  queryFn: () => getTotalDepartments(),
});

const { data: patientsCount, isLoading: isPatientsCountLoading } = useQuery({
  queryKey: ['patients-count'],
  queryFn: () => getTotalPatients(),
});

const { data: appointmentsCount, isLoading: isAppointmentsCountLoading } = useQuery({
  queryKey: ['appointments-count'],
  queryFn: () => getTotalAppointments(),
});

const stats = computed(() => [
  { label: 'Total doctors', count: doctorsCount.value, icon: PharmacyCrossTag, bgClass: 'bg-primary' },
  { label: 'Total departments', count: departmentsCount.value, icon: HomeHospital, bgClass: 'bg-warning' },
  { label: 'Total patients', count: patientsCount.value, icon: Community, bgClass: 'bg-success' },
  { label: 'Total appointments', count: appointmentsCount.value?.overallTotal ?? 0, icon: Calendar, bgClass: 'bg-info' },
])
</script>

<template>
  <div class="admin-dashboard container-fluid">
    <div>
      <TableSkeleton
          v-if="isDoctorsCountLoading || isDepartmentsCountLoading
          || isPatientsCountLoading || isAppointmentsCountLoading"
          rows="4"
          columns="4"
      />
      <div class="admin-dashboard-stats" v-else>
        <StatsCard
            v-for="(stat, i) in stats"
            :key="i"
            :count="stat.count"
            :label="stat.label"
            :icon="stat.icon"
            :bgClass="stat.bgClass"
        />
      </div>
    </div>
    <div class="dashboard-charts-wrapper">
      <DoctorsAvailabilityChart />
      <DoctorsToDepartmentsChart />
      <BookingStatsOverview
          :data="appointmentsCount"
          :appointmentsLoading="isAppointmentsCountLoading"
      />
    </div>
    <div class="dashboard-charts-wrapper">
      <MonthlyAppointmentTotalsChart />
      <EmployeesOnVacation />
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.dashboard-charts-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>