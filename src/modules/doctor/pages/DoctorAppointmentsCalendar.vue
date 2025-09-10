<script setup>
import { computed, inject } from 'vue';
import { useQuery } from "@tanstack/vue-query";
import { useUser } from "@/modules/auth/sdk/user.js";
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Loading from "@/components/Loading.vue";
import { formatDateTo24Hour, getStatusLabel } from "@/utils/helpers.js";
import moment from "moment";
import {getAppointmentsForDoctor} from "@/modules/admin/sdk/api.js";

const { user } = useUser();
const statusColors = {
  0: '#FFA500',  // Pending: Orange
  1: '#28A745',  // Confirmed: Green
  2: '#007BFF',  // Ongoing: Blue
  3: '#6F42C1',  // Finished: Purple
  4: '#DC3545',  // Cancelled: Red
};

const drAppointmentsKey = computed(() => ['doctor-appointments', user.value?.doctorId]);
const { data, isLoading } = useQuery({
  queryKey: drAppointmentsKey.value,
  queryFn: () => getAppointmentsForDoctor(Number(user.value?.doctorId)),
});

const todayAppointments = computed(() => {
  if (data?.value) {
    return data.value.filter(booking => {
      return moment(booking.startTime).isSame(moment(), 'day');
    });
  }
  return [];
});

// Filter appointments for this month
const monthAppointments = computed(() => {
  if (data?.value) {
    return data.value.filter(booking => {
      return moment(booking.startTime).isSame(moment(), 'month');
    });
  }
  return [];
});

// Transform bookings data to FullCalendar format
const events = computed(() => {
  if (data?.value) {
    return data?.value.map(booking => ({
      title: booking.notes || 'No Notes',
      start: booking.startTime,
      end: booking.endTime,
      status: booking.status,
      description: booking.notes,
      bookingId: booking.id,
      bookingPerscription: booking.prescription,
      extendedProps: {
        user: `${booking.user.firstName} ${booking.user.lastName}`,
        phone: booking.contactPhoneNumber,
        tooltipHtml: `<strong>Appointment Notes:</strong> ${booking.notes || 'N/A'}<br>
      <strong>Phone:</strong> ${booking.contactPhoneNumber || 'N/A'}<br>
      <strong>Price:</strong> ${booking.price || 'N/A'}€
    `
      },
    }));
  }
  return [];
});

const showEditAppointmentStatusPopup = inject("showEditAppointmentStatusPopup");
const openEditAppointmentStatusPopup = (data) => {
  showEditAppointmentStatusPopup({...data, revalidateKey: drAppointmentsKey});
};

// FullCalendar options
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  events: events.value,
  dayMaxEventRows: 2,
  eventClick: ({ event }) => {
    openEditAppointmentStatusPopup(event._def)
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
      <div>
        <p><strong>Today:</strong></p>
        <div v-if="todayAppointments.length > 0" class="today-appointments">
          <ul>
            <li v-for="(appointment, index) in todayAppointments" :key="index" class="d-flex align-items-center gap-3 border-bottom pb-3">
              <div
                  class="calendar-main__left-container__vacation-type__color rounded"
                  :style="{ backgroundColor: statusColors[appointment.status] }"
              ></div>
              From {{ formatDateTo24Hour(appointment.startTime) }} - {{ formatDateTo24Hour(appointment.endTime) }}
              with {{ appointment.user.firstName }} {{ appointment.user.lastName }}
            </li>
          </ul>
        </div>
        <div v-else>No appointments for today</div>
      </div>
      <div>
        <p><strong>This month:</strong></p>
        <div v-if="monthAppointments.length > 0" class="month-appointments">
          <ul>
            <li v-for="(appointment, index) in monthAppointments" :key="index" class="d-flex align-items-center gap-3 border-bottom pb-3">
              <div
                  class="calendar-main__left-container__vacation-type__color rounded"
                  :style="{ backgroundColor: statusColors[appointment.status] }"
              ></div>
              From {{ formatDateTo24Hour(appointment.startTime) }} - {{ formatDateTo24Hour(appointment.endTime) }}
              with {{ appointment.user.firstName }} {{ appointment.user.lastName }}
            </li>
          </ul>
        </div>
        <div v-else>No appointments for this month</div>
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
          <div
              class="calendar-event z-3 cursor-pointer"
              :style="{ backgroundColor: statusColors[arg.event.extendedProps.status] }"
              v-tooltip.top.html="{ value: arg.event.extendedProps.tooltipHtml, escape: false }">
            <div class="calendar-event__title">{{ arg.event.extendedProps.user }}</div>
            <div class="calendar-event__time">
              {{ formatDateTo24Hour(arg.event.start) }} - {{ formatDateTo24Hour(arg.event.end) }}
            </div>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<style>
.today-appointments, .month-appointments {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.today-appointments p, .month-appointments p {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.today-appointments ul, .month-appointments ul {
  list-style-type: none;
  padding-left: 0;
}

.today-appointments li, .month-appointments li {
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #555;
}

.fc-popover {
  z-index: 1 !important;
}

.fc-daygrid-more-link {
  background-color: #197a2e;
  color: white;
  font-size: 0.9rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s ease;
  z-index: 9999;
  width: 100%;
}

.fc-daygrid-more-link:hover {
  background-color: rgba(64, 168, 87, 0.87) !important;
}

.fc-daygrid-more-link:active {
  background-color: #004085;
  transform: scale(1);
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
  width: 340px;
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
  border-radius: 5px;
  text-align: center;
  font-size: 0.9rem;
  color: white;
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

