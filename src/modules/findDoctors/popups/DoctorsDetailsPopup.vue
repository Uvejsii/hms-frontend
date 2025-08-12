<script setup>
import {computed, inject, ref} from "vue";
import DoctorDetailsOverviewTab
  from "@/modules/findDoctors/components/doctor-details-popup-tabs/DoctorDetailsOverviewTab.vue";
import DoctorDetailsAvailabilityTab
  from "@/modules/findDoctors/components/doctor-details-popup-tabs/DoctorDetailsAvailabilityTab.vue";
import DoctorDetailsReviewsTab
  from "@/modules/findDoctors/components/doctor-details-popup-tabs/DoctorDetailsReviewsTab.vue";
import {CalendarPlus} from "@iconoir/vue";
import {useQuery} from "@tanstack/vue-query";
import {getDoctorById} from "@/modules/findDoctors/sdk/api.js";

const emit = defineEmits(['close'])
const props = defineProps(['data'])
const visible = ref(true)

const drDataKey = computed(() => ['doctorDetails', props.data.id])
const { data: drData, isLoading: isDrByIdLoading } = useQuery({
  queryKey: drDataKey,
  queryFn: () => getDoctorById(props.data.id),
})

const tabs = [
  {
    name: 'overview',
    label: 'Overview',
    component: DoctorDetailsOverviewTab,
  },
  {
    name: 'availability',
    label: 'Availability',
    component: DoctorDetailsAvailabilityTab,
  },
  {
    name: 'reviews',
    label: 'Reviews',
    component: DoctorDetailsReviewsTab,
  }
]

const showBookAppointmentPopup = inject('showBookAppointmentPopup')
const bookAppointment = (data) => {
  showBookAppointmentPopup({...data})
}

const activeTab = ref(tabs[0].name)

const cancel = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isDrByIdLoading">
    Loading...
  </div>
  <Dialog
      v-else
      style="width: 768px"
      @hide="cancel"
      :header="`Dr. ${drData.firstName} ${drData.lastName}'s details`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <div class="doctor-profile-header">
      <img :src="drData.imageFilePath" :alt="drData.name" class="profile-image" />
      <div class="profile-info">
        <h2>{{ drData.firstName }} {{ drData.lastName }}</h2>
        <p class="specialty">{{ drData.departament.name }}</p>
        <div class="rating-section">
          <Rating :modelValue="drData.reviewStarAverage" readonly :cancel="false" />
          <span class="rating-details">{{ drData.reviewStarAverage }}/5 ({{ drData.totalReviewsCount }} reviews)</span>
        </div>
      </div>
    </div>
    <Tabs v-model:value="activeTab">
        <TabList>
          <Tab v-for="tab in tabs" :key="tab.name" :value="tab.name">
            {{ tab.label }}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="tab in tabs" :key="tab.name" :value="tab.name">
            <component
                :is="tab.component"
                :data="{ ...drData, isLoading: isDrByIdLoading, drKey: drDataKey }"
            />
          </TabPanel>
        </TabPanels>
    </Tabs>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Close</Button>
      <Button @click="bookAppointment(drData)" :disabled="!drData.isAvailable"><CalendarPlus/> Book appointment</Button>
    </template>
  </Dialog>
</template>

<style scoped>
.doctor-profile-header {
  display: flex;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h2 {
  margin-bottom: var(--spacing-xs);
}

.specialty {
  color: var(--primary-color);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

.rating-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.rating-details {
  color: var(--text-secondary);
}
</style>