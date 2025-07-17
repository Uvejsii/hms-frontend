<script setup>
import {inject, ref} from "vue";
import DoctorDetailsOverviewTab
  from "@/modules/findDoctors/components/doctor-details-popup-tabs/DoctorDetailsOverviewTab.vue";
import DoctorDetailsAvailabilityTab
  from "@/modules/findDoctors/components/doctor-details-popup-tabs/DoctorDetailsAvailabilityTab.vue";
import DoctorDetailsReviewsTab
  from "@/modules/findDoctors/components/doctor-details-popup-tabs/DoctorDetailsReviewsTab.vue";
import {CalendarPlus} from "@iconoir/vue";

const emit = defineEmits(['close'])
const props = defineProps(['data'])
const visible = ref(true)

const tabs = [
  {
    name: 'overview',
    label: 'Overview',
    component: DoctorDetailsOverviewTab,
    props: {
      data: props.data
    }
  },
  {
    name: 'availability',
    label: 'Availability',
    component: DoctorDetailsAvailabilityTab,
    props: {
      data: props.data
    }
  },
  {
    name: 'reviews',
    label: 'Reviews',
    component: DoctorDetailsReviewsTab,
    props: {
      data: {...props.data},
    }
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
  <Dialog
      style="width: 768px"
      @hide="cancel"
      :header="`Dr. ${props.data.firstName} ${props.data.lastName}'s details`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <div class="doctor-profile-header">
      <img :src="props.data.imageFilePath" :alt="props.data.name" class="profile-image" />
      <div class="profile-info">
        <h2>{{ props.data.firstName }} {{ props.data.lastName }}</h2>
        <p class="specialty">{{ props.data.departament.name }}</p>
        <div class="rating-section">
          <Rating :modelValue="props.data.reviewStarAverage" readonly :cancel="false" />
          <span class="rating-details">{{ props.data.reviewStarAverage }}/5 ({{ props.data.totalReviewsCount }} reviews)</span>
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
            <component :is="tab.component" v-bind="tab.props" />
          </TabPanel>
        </TabPanels>
    </Tabs>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Close</Button>
      <Button @click="bookAppointment(props.data)"><CalendarPlus/> Book appointment</Button>
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