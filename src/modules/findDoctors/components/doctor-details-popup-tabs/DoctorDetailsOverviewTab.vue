<script setup>
import TableSkeleton from "@/components/TableSkeleton.vue";

const props = defineProps(["data"]);
</script>

<template>
  <div class="wrapper">
    <div class="overview-content">
      <TableSkeleton v-if="props.data.isLoading" rows="10" columns="2" />
      <div v-else>
        <div class="info-grid">
          <div class="info-item">
            <strong>Department:</strong>
            <span>{{ props.data.departament.name }}</span>
          </div>
          <div class="info-item">
            <strong>Experience:</strong>
            <span>{{ props.data.yearsOfExperience }} years</span>
          </div>
          <div class="info-item">
            <strong>Languages:</strong>
            <span>{{ props.data.languages }}</span>
          </div>
          <div class="info-item">
            <strong>Location:</strong>
            <span>{{ props.data.departament.location }}</span>
          </div>
          <div class="info-item">
            <strong>Consultation Fee:</strong>
            <span>{{ props.data.consultationFee }}&euro;</span>
          </div>
        </div>
        <div class="bio-section">
          <h4>About Dr. {{ props.data.firstName }} {{ props.data.lastName }}</h4>
          <p>
            Dr. {{ props.data.lastName }} is a skilled specialist in the field of {{ props.data.departament.name }},
            bringing {{ props.data.yearsOfExperience }} years of experience in delivering quality care to patients.
            Fluent in {{ props.data.languages }}, Dr. {{ props.data.lastName }} ensures clear and supportive
            communication with individuals from diverse backgrounds. You can find Dr. {{ props.data.lastName }} at
            {{ props.data.departament.location }}, offering consultations at an affordable fee of {{props .data.consultationFee }}&euro;.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overview-content {
  padding: var(--spacing-md) 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--surface-border);
}

.bio-section h4 {
  margin-bottom: var(--spacing-sm);
}

.bio-section p {
  margin-bottom: 0 !important;
}
</style>