<script setup>
import { useQuery } from "@tanstack/vue-query";
import { getAvailableAppointments } from "@/modules/findDoctors/sdk/api.js";
import {formatDate, formatDateTo24Hour} from "@/utils/helpers.js";
import moment from "moment";
import {computed, inject, ref, watch} from "vue";
import TableSkeleton from "@/components/TableSkeleton.vue";

const props = defineProps(['data']);
const today = moment().format('D');
const todayDate = moment().format('YYYY-MM-DD');

const selectedDate = ref(null);

const drAvailabilityKey = computed(() => [
  'doctorAvailability',
  props.data.id,
  selectedDate.value ? moment(selectedDate.value).format('YYYY-MM-DD') : todayDate
]);
const { data, isLoading, refetch } = useQuery({
  queryKey: drAvailabilityKey,
  queryFn: () => {
    const date = selectedDate.value ? moment(selectedDate.value) : moment();
    const year = date.year();
    const month = date.month() + 1; // Months are zero-indexed in moment.js
    const day = date.date();

    return getAvailableAppointments(props.data.id, year, month, day);
  },
});

watch(selectedDate, (newDate) => {
  if (newDate) {
    refetch();
  }
});

const showBookAppointmentPopup = inject('showBookAppointmentPopup')
const bookAppointment = (data) => {
  showBookAppointmentPopup({...data, drAvailabilityKey})
}
</script>

<template>
  <div class="availability-content">
    <div class="calendar-container">
      <h4>Select a Date</h4>
      <DatePicker v-model="selectedDate" :inline="true" :dateFormat="'dd/mm/yy'" showIcon />
    </div>

    <h4>Schedule for {{ selectedDate ? formatDate(selectedDate) : todayDate }}</h4>
    <TableSkeleton v-if="isLoading" rows="4" columns="10" />
    <div v-if="!data || data?.length < 1" class="unavailable text-center my-5">
      <p class="p-0">Doctor is not available at this date</p>
    </div>
    <div v-else class="schedule-grid">
      <div v-for="item in data" :key="item.start" class="schedule-day">
        <div class="day-name">{{ formatDateTo24Hour(item.start) }}</div>
        <div class="day-name">{{ formatDateTo24Hour(item.end) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.availability-content {
  padding: var(--spacing-md) 0;
  font-family: 'Arial', sans-serif;
}

.calendar-container {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-sm);
  background-color: var(--surface-light);
  border-radius: var(--border-radius);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.schedule-day {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--spacing-sm);
  background-color: var(--surface-ground);
  border-radius: var(--border-radius);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.day-name {
  font-weight: var(--font-weight-semibold);
  color: var(--primary-color);
}

.day-times {
  margin-top: var(--spacing-sm);
}

.unavailable {
  color: var(--text-muted);
  font-style: italic;
}

.next-slots h4 {
  margin-bottom: var(--spacing-md);
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.time-slot {
  min-width: 120px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  transition: background-color 0.3s ease;
}

.time-slot:hover {
  background-color: var(--primary-color-dark);
}

.p-button-outlined {
  padding: 5px 15px;
  font-size: 1rem;
}
</style>
