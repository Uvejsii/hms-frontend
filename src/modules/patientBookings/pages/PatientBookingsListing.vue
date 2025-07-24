<script setup>
import { ref, computed } from 'vue';
import { getBookingsByUserId } from "@/modules/patientBookings/sdk/api.js";
import { useQuery } from "@tanstack/vue-query";
import { useUser } from "@/modules/auth/sdk/user.js";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Loading from "@/components/Loading.vue";
import { formatDateTo24Hour } from "@/utils/helpers.js";

const { user } = useUser();
const statusColors = {
  0: '#FFA500',  // Pending: Orange
  1: '#28A745',  // Confirmed: Green
  2: '#007BFF',  // Ongoing: Blue
  3: '#6F42C1',  // Finished: Purple
  4: '#DC3545',  // Cancelled: Red
};

const getStatusLabel = (status) => {
  const labels = {
    0: 'Pending',
    1: 'Confirmed',
    2: 'Ongoing',
    3: 'Finished',
    4: 'Cancelled',
  };
  return labels[status] || 'Unknown';  // Return 'Unknown' if status is not in the map
};

const { data, isLoading } = useQuery({
  queryKey: ['patientBookings', user.value?.id],
  queryFn: () => getBookingsByUserId(user.value?.id),
});

// Transform bookings data to FullCalendar format
const events = computed(() => {
  if (data?.value) {
    return data?.value.map(booking => ({
      title: booking.notes || 'No Notes',
      start: booking.startTime,
      end: booking.endTime,
      status: booking.status,  // Status is now a number
      description: booking.notes,
      extendedProps: {
        doctor: `Dr. ${booking.doctor.firstName} ${booking.doctor.lastName}`,
        phone: booking.contactPhoneNumber,
      },
    }));
  }
  return [];
});

// FullCalendar options
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events.value, // Bind the transformed events to FullCalendar
  eventClick: function (info) {
    alert(`Event clicked: ${info.event.title}`);
  },
}));
</script>

<template>
  <div class="calendar-main">
    <Loading v-if="isLoading" />
    <div class="calendar-main__left-container">
      <div class="calendar-main__left-container__vacation-types">
        <p>Types of statuses</p>
        <div v-for="(color, status) in statusColors" :key="status" class="d-flex align-items-center gap-2">
          <div class="calendar-main__left-container__vacation-type__color rounded" :style="{ backgroundColor: color }"></div>
          <p class="m-0">{{ getStatusLabel(status) }}</p>
        </div>
      </div>
    </div>
    <div class="calendar-main__right-container">
      <FullCalendar
          ref="calendarRef"
          class="demo-app-calendar"
          :options="calendarOptions"
          :key="JSON.stringify(events)"
      >
        <template v-slot:eventContent="arg">
          <div class="calendar-event" :style="{ backgroundColor: statusColors[arg.event.extendedProps.status] }">
            <div class="calendar-event__title">{{ arg.event.extendedProps.doctor }}</div>
            <div class="calendar-event__time">
              {{ formatDateTo24Hour(arg.event.start) }} - {{ formatDateTo24Hour(arg.event.end) }}
            </div>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<style scoped>
.view-holidays-button {
  position: absolute;
  right: 1.3%;
  z-index: 1;
}

.view-holidays-button .p-button {
  height: 45px;
  background-color: transparent;
  color: #2B2B2B;
}

.fc .fc-toolbar.fc-header-toolbar {
  position: relative;
}

.calendar-main {
  display: flex;
  width: 100%;
  height: calc(100vh - 133px);
  position: relative;
}

.calendar-main__left-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 300px;
  border-right: 1px solid #eae9ea;
  padding: 17px 20px;
}

.calendar-main__left-container__vacation-type__color {
  width: 20px;
  height: 20px;
}

.calendar-main__left-container__title {
  font-weight: 600;
}

.calendar-main__left-container__vacation-types,
.calendar-main__left-container__today,
.calendar-main__left-container__month {
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 8px;
}

.calendar-main__right-container {
  width: 100%;
  padding: 17px;
}

/* Event styling */
.calendar-event {
  padding: 10px;
  border: 1px solid transparent;
  border-radius: 5px;
  text-align: center;
  font-size: 0.9rem;
  color: white; /* Ensure the text is visible against the background */
  font-weight: bold;
  width: 100%;
}

.calendar-event__title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.calendar-event__time {
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-main {
    flex-direction: column;
  }

  .calendar-main__left-container {
    width: 100%;
    border-right: none;
  }

  .calendar-main__right-container {
    width: 100%;
  }
}
</style>

