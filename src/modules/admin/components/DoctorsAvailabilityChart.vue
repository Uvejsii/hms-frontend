<script setup>
import {useQuery} from "@tanstack/vue-query";
import {getTotalAvailableDoctors, getTotalUnavailableDoctors} from "@/modules/admin/sdk/api.js";
import {computed, ref} from "vue";
import {Doughnut} from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import TableSkeleton from "@/components/TableSkeleton.vue";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const { data: availableDoctorsCount, isLoading: isAvailableDoctorsCountLoading } = useQuery({
  queryKey: ['available-doctors-count'],
  queryFn: () => getTotalAvailableDoctors(),
});

const { data: unavailableDoctorsCount, isLoading: isUnavailableDoctorsCountLoading } = useQuery({
  queryKey: ['unavailable-doctors-count'],
  queryFn: () => getTotalUnavailableDoctors(),
});

const chartData = computed(() => {
  if (availableDoctorsCount.value && unavailableDoctorsCount.value) {
    return {
      labels: [`Available Doctors (${availableDoctorsCount.value})`, `Unavailable Doctors (${unavailableDoctorsCount.value})`],
      datasets: [
        {
          rotation: Math.PI - 40,
          data: [availableDoctorsCount, unavailableDoctorsCount],
          backgroundColor: ['#40ed50', '#e63131'],
          hoverBackgroundColor: ['#a2f3aa', '#f66d6d'],
        },
      ],
    };
  } else {
    return {
      labels: [],
      datasets: [],
    };
  }
});

const chartOptions = ref({
  responsive: false,
  borderWidth: 0,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      paddingLeft: 100,
      position: 'right',
      labels: {
        padding: 14,
        boxWidth: 30,
        color: '#000000'
      },
    }
  },
})
</script>

<template>
  <div class="admin-dashboard-chart">
    <div class="admin-dashboard-chart-title">
      <p>Doctors availability</p>
    </div>
    <div class="p-3">
      <TableSkeleton
          v-if="isAvailableDoctorsCountLoading && isUnavailableDoctorsCountLoading"
          rows="9"
          columns="1"
      />
      <Doughnut v-else :width="370" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
</style>