<script setup>
import {useQuery} from "@tanstack/vue-query";
import {getMonthlyAppointmentTotals} from "@/modules/admin/sdk/api.js";
import {Bar} from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import TableSkeleton from "@/components/TableSkeleton.vue";
import {computed, ref} from "vue";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);


const { data: monthlyTotals, isLoading: isMonthlyTotalsLoading } = useQuery({
  queryKey: ['appointment-monthly-totals'],
  queryFn: () => getMonthlyAppointmentTotals(),
});

const chartData = computed(() => {
  if (monthlyTotals.value) {
    const monthlyPrices = Array(12).fill(0);

    monthlyTotals.value.forEach(item => {
      monthlyPrices[item.month - 1] = item.totalPrice;
    });

    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'],
      datasets: [
        {
          data: monthlyPrices,
          backgroundColor: '#40ed50',
          hoverBackgroundColor: '#a2f3aa',
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
      display: false,
    }
  },
})
</script>

<template>
  <div class="admin-dashboard-chart-large">
    <div class="admin-dashboard-chart-title">
      <p>Monthly Totals</p>
    </div>
    <div class="p-3">
      <TableSkeleton
          v-if="isMonthlyTotalsLoading"
          rows="10"
          columns="1"
      />
      <Bar v-else :width="600" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard-chart-large {
  height: 100%;
}
</style>