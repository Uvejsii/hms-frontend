<script setup>

</script>

<template>
  <div class="hospital-footer">
    <div class="footer-container">
      <div class="footer-column">
        <h3>HealthSync Hospital</h3>
        <p>Providing compassionate healthcare for your family, 24/7.</p>
      </div>

      <div class="footer-column">
        <h4>Quick Links</h4>
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/patient-appointments">Appointments</RouterLink></li>
        </ul>
      </div>

      <div class="footer-column">
        <h4>Contact</h4>
        <p>Muharrem Fejza, Prishtina, 10000</p>
        <p>Phone: +383 44 290 348</p>
        <p>Email: info@healthsync.com</p>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 CityCare Hospital. All rights reserved.</p>
    </div>
  </div>

</template>

<style scoped>
.hospital-footer {
  background-color: var(--secondary-color);
  color: #ffffff;
  padding: 40px 20px 20px;
  font-family: 'Arial', sans-serif;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-column {
  flex: 1 1 250px;
  margin: 10px;
}

.footer-column h3,
.footer-column h4 {
  color: #ffffff;
  margin-bottom: 10px;
}

.footer-column p,
.footer-column a {
  font-size: 14px;
  color: #ffffff;
  text-decoration: none;
}

.footer-column a:hover {
  text-decoration: underline;
  color: #ffffff;
}

.footer-bottom {
  border-top: 1px solid #ffffff;
  text-align: center;
  padding-top: 15px;
  margin-top: 20px;
  font-size: 13px;
  color: #ffffff;
}
</style>