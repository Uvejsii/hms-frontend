<script setup>
import {useQuery} from "@tanstack/vue-query";
import {getDoctorCountPerDepartment} from "@/modules/admin/sdk/api.js";
import {computed} from "vue";
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import TableSkeleton from "@/components/TableSkeleton.vue";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const { data: departments, isLoading: isDepartmentsLoading } = useQuery({
  queryKey: ['departments'],
  queryFn: () => getDoctorCountPerDepartment(),
});

const departmentData = computed(() => {
  if (departments.value) {
    const departmentNames = departments.value?.map(department => department?.departmentName);
    const doctorCounts = departments.value?.map(department => department?.doctorCount);

    return {
      labels: departmentNames,
      datasets: [
        {
          data: doctorCounts,
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
          hoverBackgroundColor: ['#ff497c', '#5f92da', '#a44bee', '#ffb832', '#5bd7d7'],
        }
      ]
    }
  } else {
    return { labels: [], datasets: [] };
  }
});

const departmentChartOptions = computed(() => ({
  responsive: false,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      position: 'right',
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return tooltipItem.label + ': ' + tooltipItem.raw;
        }
      }
    }
  }
}));
</script>

<template>
  <div class="admin-dashboard-chart">
    <div class="admin-dashboard-chart-title">
      <p>Doctors to departments</p>
    </div>
    <div class="p-3">
      <TableSkeleton
          v-if="isDepartmentsLoading"
          rows="10"
          columns="1"
      />
      <Pie v-else :width="470" :data="departmentData" :options="departmentChartOptions" />
    </div>
  </div>
</template>

<style scoped>
</style>