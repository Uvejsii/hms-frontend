<script setup>
import { useUser } from "@/modules/auth/sdk/user.js";

const { user } = useUser();
</script>

<template>
  <div class="dashboard-container">
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
          <span>120</span>
        </div>
      </div>
      <div class="stat-card card">
        <i class="fas fa-calendar-check"></i>
        <div>
          <h3>Appointments</h3>
          <span>15 Today</span>
        </div>
      </div>
      <div class="stat-card card">
        <i class="fas fa-hospital"></i>
        <div>
          <h3>Departments</h3>
          <span>3</span>
        </div>
      </div>
    </div>
    <div class="appointments-card card">
      <h3>Upcoming Appointments</h3>
      <ul>
        <li>
          <span>09:00 AM</span> - Jane Smith
        </li>
        <li>
          <span>10:30 AM</span> - Bob Johnson
        </li>
        <li>
          <span>12:00 PM</span> - Alice Brown
        </li>
      </ul>
    </div>
    <div class="departments-card card">
      <h3>Departments</h3>
      <ul>
        <li>Cardiology (5)</li>
        <li>Neurology (3)</li>
        <li>Pediatrics (4)</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 900px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Segoe UI', Arial, sans-serif;
}
.card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 24px;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}
.profile-card {
  display: flex;
  align-items: center;
  gap: 20px;
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
  gap: 16px;
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
  padding: 8px 0;
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
  margin-bottom: 12px;
  color: #4f8cff;
}
</style>