<script setup>
import { useUser } from "@/modules/auth/sdk/user.js";
import {useQuery} from "@tanstack/vue-query";
import {getAllDoctorReviews, getAppointmentsForToday, getTotalPatientsAndEarnings} from "@/modules/doctor/sdk/api.js";
import TableSkeleton from "@/components/TableSkeleton.vue";
import { useHospitalStore } from "@/stores/hospital.js";
import {formatDateTo24Hour} from "@/utils/helpers.js";

const hospitalStore = useHospitalStore();
const { user } = useUser();

const { data: doctorReviews, isLoaing: isLoadingReviews, isError: isErrorReviews } = useQuery({
  queryKey: ['doctor-reviews', user?.value?.doctorId],
  queryFn: () => getAllDoctorReviews(Number(user?.value?.doctorId)),
  refetchOnWindowFocus: true,
})

const { data: appointments, isLoaing: isLoadingAppointments, isError: isErrorAppointments } = useQuery({
  queryKey: ['today-appointments', user?.value?.doctorId],
  queryFn: () => getAppointmentsForToday(Number(user?.value?.doctorId)),
  refetchOnWindowFocus: true,
})

const { data: patientsAndEarnings, isLoaing: isLoadingpatientsAndEarnings, isError: isErrorpatientsAndEarnings } = useQuery({
  queryKey: ['total-patients-earnings', user?.value?.doctorId],
  queryFn: () => getTotalPatientsAndEarnings(Number(user?.value?.doctorId)),
  refetchOnWindowFocus: true,
})
</script>

<template>
  <div class="dashboard-container container-fluid">
    <div class="profile-card card">
      <img :src="user?.profileImage" alt="Doctor" class="avatar" />
      <div>
        <h2>Dr. {{ user?.firstName }} {{ user?.lastName }}</h2>
        <p>{{ user?.department }}</p>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat-card card">
        <i class="fas fa-user-md"></i>
        <div>
          <h3>Patients</h3>
          <span>{{ patientsAndEarnings?.totalPatients }}</span>
        </div>
      </div>
      <div class="stat-card card">
        <i class="fas fa-calendar-check"></i>
        <div>
          <h3>Appointments</h3>
          <span>{{ appointments?.length }} Today</span>
        </div>
      </div>
      <div class="stat-card card">
        <i class="fas fa-hospital"></i>
        <div>
          <h3>Total earnings</h3>
          <span>{{ patientsAndEarnings?.totalEarnings.toFixed(2) }} &euro;</span>
        </div>
      </div>
    </div>
    <div class="appointments-card card">
      <h3>Upcoming Appointments Today</h3>
      <DataTable
          :value="appointments"
          :paginator="true"
          :rows="hospitalStore.itemsPerPage"
          :totalRecords="appointments?.length"
          :first="hospitalStore.currentPage"
          @page="hospitalStore.onPage"
      >
        <Column header="No.">
          <template #body="{ index }">
            <span>{{ appointments?.length - (hospitalStore.currentPage + index) }}.</span>
          </template>>
        </Column>
        <Column header="Time">
          <template #body="{ data }">
            <span>{{ formatDateTo24Hour(data.startTime) }} - {{ formatDateTo24Hour(data.endTime) }}</span>
          </template>
        </Column>
        <Column header="Patient">
          <template #body="{ data }">
            <span>
              {{ data.user.firstName }} {{ data.user.lastName }}
            </span>
          </template>
        </Column>
        <Column header="Email" field="user.email" />
        <template #empty>
          <TableSkeleton rows="10" columns="7" v-if="isLoadingAppointments" />
          <p v-if="isErrorAppointments">Something went wrong, please try again.</p>
          <template v-if="!isLoadingAppointments && !isErrorAppointments">
            <p class="text-center m-0">
              No appointments found.
            </p>
          </template>
        </template>
      </DataTable>
    </div>
    <div class="departments-card card">
      <h3>Patient Reviews</h3>
      <DataTable
          :value="doctorReviews"
          :paginator="true"
          :rows="hospitalStore.itemsPerPage"
          :totalRecords="doctorReviews?.length"
          :first="hospitalStore.currentPage"
          @page="hospitalStore.onPage"
      >
        <Column header="No.">
          <template #body="{ index }">
            <span>{{ doctorReviews?.length - (hospitalStore.currentPage + index) }}.</span>
          </template>>
        </Column>
        <Column header="Patient" field="reviewer.email" />
        <Column header="Review" field="comment">
          <template #body="{ data }">
            <span class="notes-ellipsis" v-tooltip.top="data.comment">
              {{ data.comment || 'No comment provided' }}
            </span>
          </template>
        </Column>
        <Column header="Stars">
          <template #body="{ data }">
            <Rating :modelValue="data.stars" readonly />
          </template>
        </Column>
        <template #empty>
          <TableSkeleton rows="10" columns="7" v-if="isLoadingReviews" />
          <p v-if="isErrorReviews">Something went wrong, please try again.</p>
          <template v-if="!isLoadingReviews && !isErrorReviews">
            <p class="text-center m-0">
              No reviews found.
            </p>
          </template>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 14px;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}
.profile-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(90deg, #4f8cff 0%, #38e8ff 100%);
  color: #fff;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #fff;
  object-fit: cover;
}
.stats-row {
  display: flex;
  gap: 20px;
}
.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f7faff;
  color: #4f8cff;
}
.stat-card i {
  font-size: 2.2em;
}
.stat-card h3 {
  margin: 0;
  font-size: 1.1em;
  font-weight: 600;
}
.stat-card span {
  font-size: 1.3em;
  font-weight: 700;
}
.appointments-card ul,
.departments-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.appointments-card li,
.departments-card li {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
  font-size: 1em;
}
.appointments-card li span {
  font-weight: 600;
  color: #4f8cff;
  margin-right: 10px;
}
.appointments-card h3,
.departments-card h3 {
  margin-bottom: 7px;
  color: #4f8cff;
}
.notes-ellipsis {
  display: inline-block;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
</style>