<script setup>
import {ref, computed, onMounted, inject} from 'vue'
import { useToast } from 'primevue/usetoast'
import { Search, Circle, City, Clock, MapPin, Language, Calendar as CalendarIcon, User, CalendarPlus, ViewGrid, List } from "@iconoir/vue";
import {useQuery} from "@tanstack/vue-query";
import {getDoctors} from "@/modules/findDoctors/sdk/api.js";

const toast = useToast()

// State
const searchQuery = ref('')
const selectedDepartment = ref(null)
const selectedAvailability = ref(null)
const selectedExperience = ref(null)
const selectedRating = ref(null)
const viewMode = ref('grid')
const showDoctorDialog = ref(false)
const selectedDoctor = ref(null)
const showBookingDialog = ref(false)
const bookingDoctor = ref(null)
const bookingDate = ref(null)
const bookingTime = ref(null)
const bookingReason = ref('')
const bookingPhone = ref('')

const { data, isLoading: doctorsLoading} = useQuery({
  queryKey: ['doctors'],
  queryFn: getDoctors
})

// Filter options
const departments = ref([
  { name: 'Cardiology', code: 'cardiology' },
  { name: 'Neurology', code: 'neurology' },
  { name: 'Pediatrics', code: 'pediatrics' },
  { name: 'Orthopedics', code: 'orthopedics' },
  { name: 'Dermatology', code: 'dermatology' },
  { name: 'Oncology', code: 'oncology' },
  { name: 'Psychiatry', code: 'psychiatry' },
  { name: 'Emergency Medicine', code: 'emergency' },
  { name: 'Internal Medicine', code: 'internal' },
  { name: 'Surgery', code: 'surgery' }
])

const availabilityOptions = ref([
  { name: 'Available', code: true },
  { name: 'Unavailable', code: false },
])

const experienceOptions = ref([
  { name: '5+ Years', code: '5+' },
  { name: '10+ Years', code: '10+' },
  { name: '15+ Years', code: '15+' },
  { name: '20+ Years', code: '20+' }
])

const ratingOptions = ref([
  { name: '4+ Stars', code: '4+' },
  { name: '4.5+ Stars', code: '4.5+' }
])

// Computed
const filteredDoctors = computed(() => {
  let filtered = data.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doctor =>
        doctor.firstName.toLowerCase().includes(query) ||
        doctor.lastName.toLowerCase().includes(query) ||
        doctor.departament.name.toLowerCase().includes(query)
    )
  }

  // Department filter
  if (selectedDepartment.value) {
    filtered = filtered.filter(doctor =>
        doctor.departament.name.toLowerCase() === selectedDepartment.value
    )
  }

  // Availability filter
if (selectedAvailability.value !== null) {
  filtered = filtered.filter(doctor => {
    if (selectedAvailability.value === true) {
      return doctor.isAvailable === true
    }
    return doctor.isAvailable !== true
  })
}

  // Experience filter
  if (selectedExperience.value) {
    const minYears = parseInt(selectedExperience.value.replace('+', ''))
    filtered = filtered.filter(doctor => doctor.yearsOfExperience >= minYears)
  }

  // Rating filter
  if (selectedRating.value) {
    const minRating = parseFloat(selectedRating.value.replace('+', ''))
    filtered = filtered.filter(doctor => doctor.rating >= minRating)
  }

  return filtered
})

const availableTimeSlots = computed(() => {
  if (!bookingDoctor.value) return []
  return bookingDoctor.value.nextSlots || []
})

// Methods
const showDoctorDetails = (doctor) => {
  selectedDoctor.value = doctor
  showDoctorDialog.value = true
}

const bookAppointment = (doctor) => {
  bookingDoctor.value = doctor
  showBookingDialog.value = true
  showDoctorDialog.value = false
}

const confirmBooking = () => {
  if (!bookingDate.value || !bookingTime.value || !bookingReason.value) {
    toast.add({
      severity: 'warn',
      summary: 'Missing Information',
      detail: 'Please fill in all required fields',
      life: 3000
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Appointment Booked',
    detail: `Your appointment with ${bookingDoctor.value.name} has been scheduled`,
    life: 5000
  })

  // Reset form
  showBookingDialog.value = false
  bookingDate.value = null
  bookingTime.value = null
  bookingReason.value = ''
  bookingPhone.value = ''
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedDepartment.value = null
  selectedAvailability.value = null
  selectedExperience.value = null
  selectedRating.value = null
}

const showDoctorDetailsPopup = inject('showDoctorDetailsPopup')
const viewDoctorDetails = (doctor) => {
  showDoctorDetailsPopup(doctor)
}
</script>

<template>
  <div class="home-welcome-container">
    <div class="header-content">
      <h1>Find Your Doctor</h1>
      <p>Browse our experienced medical professionals and book your appointment</p>
    </div>
    <div class="search-filters-section">
      <div class="search-container">
        <span class="p-input-icon-left">
<!--          <Search />-->
          <InputText
              v-model="searchQuery"
              placeholder="Search doctors by name, specialty, or condition..."
              class="search-input"
          />
        </span>
      </div>

      <div class="filters-container">
        <div class="filter-group">
          <label>Department</label>
          <Select
              v-model="selectedDepartment"
              :options="departments"
              optionLabel="name"
              optionValue="code"
              placeholder="All Departments"
              showClear
              class="filter-dropdown"
          />
        </div>

        <div class="filter-group">
          <label>Availability</label>
          <Select
              v-model="selectedAvailability"
              :options="availabilityOptions"
              optionLabel="name"
              optionValue="code"
              placeholder="Any Time"
              showClear
              class="filter-dropdown"
          />
        </div>

        <div class="filter-group">
          <label>Experience</label>
          <Select
              v-model="selectedExperience"
              :options="experienceOptions"
              optionLabel="name"
              optionValue="code"
              placeholder="Any Experience"
              showClear
              class="filter-dropdown"
          />
        </div>

        <div class="filter-group">
          <label>Rating</label>
          <Select
              v-model="selectedRating"
              :options="ratingOptions"
              optionLabel="name"
              optionValue="code"
              placeholder="Any Rating"
              showClear
              class="filter-dropdown"
          />
        </div>
      </div>
    </div>

    <div class="results-summary">
      <div class="results-count">
        <span class="count">{{ filteredDoctors?.length }}</span>
        <span class="text">{{ filteredDoctors?.length === 1 ? ' doctor' : ' doctors' }} found</span>
      </div>

      <div class="view-toggle">
        <Button
            :class="{ 'p-button-outlined': viewMode !== 'grid' }"
            @click="viewMode = 'grid'"
            v-tooltip.top="'Grid View'"
        >
          <ViewGrid />
        </Button>
        <Button
            :class="{ 'p-button-outlined': viewMode !== 'list' }"
            @click="viewMode = 'list'"
            v-tooltip.top="'List View'"
        >
          <List />
        </Button>
      </div>
    </div>

    <div v-if="doctorsLoading">Loading....</div>
    <div v-else class="doctors-container" :class="viewMode">
      <div
          v-for="doctor in filteredDoctors"
          :key="doctor.id"
          class="doctor-card"
          @click="showDoctorDetails(doctor)"
      >
        <Button @click="viewDoctorDetails(doctor)" />
        <div class="doctor-image">
          <img :src="doctor.imageFilePath" :alt="doctor.name" />
          <div class="availability-badge" :class="doctor.isAvailable ? 'available' : 'unavailable'">
            <Circle fill="white" />
            {{ doctor.isAvailable ? 'Available' : 'Unavailable' }}
          </div>
        </div>

        <div class="doctor-info">
          <div class="doctor-header">
            <h3 class="doctor-name">{{ doctor.firstName }} {{ doctor.lastName }}</h3>
            <div class="doctor-rating">
              <Rating :modelValue="doctor.reviewStarAverage" readonly :cancel="false" />
              <span class="rating-text">({{ doctor.totalReviewsCount }})</span>
            </div>
          </div>

          <div class="doctor-department">
            <City />
            {{ doctor.departament.name }}
          </div>

          <div class="doctor-experience">
            <Clock />
            {{ doctor.yearsOfExperience }} {{ doctor.yearsOfExperience === 1 ? 'year' : 'years' }} experience
          </div>

          <div class="doctor-location">
            <MapPin />
            {{ doctor.departament.location }}
          </div>

          <div class="doctor-languages">
            <Language />
            {{ doctor.languages }}
          </div>

          <div class="doctor-actions">
            <Button
                class="p-button-outlined"
                @click.stop="showDoctorDetails(doctor)"
            >
              <User /> View Profile
            </Button>
            <Button
                @click.stop="bookAppointment(doctor)"
                :disabled="doctor.isAvailable === false"
            >
              <CalendarPlus /> Book
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredDoctors?.length === 0" class="no-results">
      <h3>No doctors found with "{{ searchQuery }}"</h3>
      <p>Try adjusting your search criteria or filters</p>
      <Button label="Clear Filters" @click="clearFilters" class="p-button-outlined" />
    </div>

    <Dialog
        v-model:visible="showBookingDialog"
        header="Book Appointment"
        modal
        style="width: 40rem"
    >
      <div v-if="bookingDoctor" class="booking-form">
        <div class="booking-doctor-info">
          <img :src="bookingDoctor.imageFilePath" :alt="bookingDoctor.name" class="booking-doctor-image" />
          <div>
            <h4>{{ bookingDoctor.name }}</h4>
            <p>{{ bookingDoctor.specialty }}</p>
            <p class="consultation-fee">Consultation Fee: ${{ bookingDoctor.consultationFee }}</p>
          </div>
        </div>

        <div class="booking-fields">
          <div class="form-group">
            <label>Appointment Date</label>
            <DatePicker v-model="bookingDate" dateFormat="mm/dd/yy" :minDate="new Date()" />
          </div>

          <div class="form-group">
            <label>Preferred Time</label>
            <Dropdown
                v-model="bookingTime"
                :options="availableTimeSlots"
                placeholder="Select time slot"
            />
          </div>

          <div class="form-group">
            <label>Reason for Visit</label>
            <Textarea v-model="bookingReason" rows="3" placeholder="Describe your symptoms or reason for consultation..." />
          </div>

          <div class="form-group">
            <label>Contact Information</label>
            <InputText v-model="bookingPhone" placeholder="Phone number" />
          </div>
        </div>

        <div class="booking-actions">
          <Button label="Cancel" class="p-button-outlined" @click="showBookingDialog = false" />
          <Button label="Confirm Booking" @click="confirmBooking" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.header-content {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 20px;
}

.header-content p {
  font-size: 1.125rem;
  opacity: 0.9;
}


\\FILTERS,
.search-filters-section {
  background-color: var(--surface-card);
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 35px;
}

.search-container {
  margin-bottom: 40px;
}

.search-input {
  width: 100%;
  font-size: 1rem;
  padding: 20px;
}

.filters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color:  var(--text-secondary);
}

.filter-dropdown {
  width: 100%;
}

.doctors-directory {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: var(--border-radius);
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-sm);
}

.page-header p {
  font-size: 1.125rem;
  opacity: 0.9;
}

.search-filters-section {
  background-color: var(--surface-card);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--box-shadow);
}

.search-container {
  margin-bottom: var(--spacing-lg);
}

.search-input {
  width: 100%;
  font-size: 1rem;
  padding: var(--spacing-md);
}

.filters-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.filter-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
}

.filter-dropdown {
  width: 100%;
}

.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md) 0;
}

.results-count .count {
  font-size: 1.5rem;
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
}

.doctors-container {
  display: grid;
  gap: var(--spacing-lg);
}

.doctors-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.doctors-container.list {
  grid-template-columns: 1fr;
}

.doctor-card {
  background-color: var(--surface-card);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: all var(--transition-speed);
  cursor: pointer;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.doctors-container.list .doctor-card {
  display: flex;
}

.doctor-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.doctors-container.list .doctor-image {
  width: 200px;
  height: auto;
  flex-shrink: 0;
}

.doctor-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.availability-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: 4px;
}

.availability-badge.available {
  background-color: rgba(34, 197, 94, 0.9);
  color: white;
}

.availability-badge.busy {
  background-color: rgba(245, 158, 11, 0.9);
  color: white;
}

.availability-badge.unavailable {
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
}

.doctor-info {
  padding: var(--spacing-lg);
}

.doctor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.doctor-name {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-color);
}

.doctor-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.rating-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.doctor-specialty,
.doctor-department,
.doctor-experience,
.doctor-location,
.doctor-languages,
.doctor-next-available {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.doctor-specialty i,
.doctor-department i,
.doctor-experience i,
.doctor-location i,
.doctor-languages i,
.doctor-next-available i {
  color: var(--primary-color);
  width: 16px;
}

.doctor-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
}

.doctor-actions .p-button {
  flex: 1;
}

.no-results {
  text-align: center;
  padding: var(--spacing-xxl);
  background-color: var(--surface-card);
  border-radius: var(--border-radius);
}

.no-results i {
  font-size: 3rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-md);
}

.no-results h3 {
  margin-bottom: var(--spacing-sm);
}

.no-results p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* Booking Dialog */
.booking-doctor-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--surface-ground);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
}

.booking-doctor-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.consultation-fee {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
}

.booking-fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-semibold);
}

.booking-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .filters-container {
    grid-template-columns: 1fr;
  }

  .results-summary {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .doctors-container.grid {
    grid-template-columns: 1fr;
  }

  .doctors-container.list .doctor-card {
    flex-direction: column;
  }

  .doctors-container.list .doctor-image {
    width: 100%;
    height: 200px;
  }

  .doctor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .doctor-actions {
    flex-direction: column;
  }

  .profile-info {
    text-align: center;
  }

  .doctor-profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .time-slots {
    justify-content: center;
  }
}
</style>