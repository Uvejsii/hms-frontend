<script setup>
import {getDoctors} from "@/modules/findDoctors/sdk/api.js";
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import { Check, Xmark, EditPencil, Trash, Restart, Calendar, Airplane } from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import {computed, inject} from "vue";
import { useHospitalStore } from "@/stores/hospital.js";

const hospitalStore = useHospitalStore();
const queryKey = ['doctors-active'];

const { data: doctors, isLoading: IsDoctorsLoading, isError: isDoctorsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getDoctors(true),
});

const filteredDoctors = computed(() => {
  if (!doctors?.value) return []
  const term = hospitalStore.doctorSearchTerm.toLowerCase()
  return doctors.value.filter(d =>
      d.firstName?.toLowerCase().includes(term) ||
      d.lastName?.toLowerCase().includes(term) ||
      d.email?.toLowerCase().includes(term)
  )
})

const showEditDoctorPopup = inject('showEditDoctorPopup')
const openEditDoctorPopup = (data) => {
  showEditDoctorPopup({...data});
}

const showUpdateDoctorStatusPopup = inject('showUpdateDoctorStatusPopup')
const openUpdateDoctorStatusPopup = (data) => {
  showUpdateDoctorStatusPopup({...data, revalidateKey: queryKey });
}

const showResetPasswordPopup = inject('showResetPasswordPopup')
const openResetPasswordPopup = (data) => {
  showResetPasswordPopup({...data });
}

const showDoctorsAppointmentsSidebarPopup = inject('showDoctorsAppointmentsSidebarPopup')
const openDoctorsAppointmentsSidebarPopup = (data) => {
  showDoctorsAppointmentsSidebarPopup({...data });
}

const showDoctorsVacationsSidebarPopup = inject('showDoctorsVacationsSidebarPopup')
const openDoctorsVacationsSidebarPopup = (data) => {
  showDoctorsVacationsSidebarPopup({...data });
}
</script>

<template>
  <DataTable
      :value="filteredDoctors"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="hospitalStore.itemsPerPage"
      :totalRecords="filteredDoctors.length"
      :first="hospitalStore.currentPage"
      @page="hospitalStore.onPage"
  >
    <Column header="No.">
      <template #body="{ index }">
        <span>{{ filteredDoctors.length - (hospitalStore.currentPage + index) }}.</span>
      </template>>
    </Column>
    <Column header="Doctor">
      <template #body="{ data }">
        <div class="d-flex gap-4 align-items-center">
          <Image :src="`${data?.imageFilePath}`" imageClass="doctor-image" preview alt="Doctor Image" />
          <span>{{ data?.firstName }} {{ data?.lastName }}</span>
        </div>
      </template>
    </Column>
    <Column header="Email" field="email" />
    <Column header="Department">
      <template #body="{ data }">
        <span>{{ data?.departament?.name }}</span>
      </template>
    </Column>
    <Column header="Experience">
      <template #body="{ data }">
        <span>{{ data?.yearsOfExperience }} years</span>
      </template>
    </Column>
    <Column header="Consultation Fee">
      <template #body="{ data }">
        <span>{{ data?.consultationFee.toFixed(2) }} &euro;</span>
      </template>
    </Column>
    <Column header="Phone number" field="phoneNumber" />
    <Column header="Actions">
      <template #body="{ data }">
        <ActionMenu>
          <ActionMenuItem @click="openEditDoctorPopup(data)">
            <EditPencil/> Edit
          </ActionMenuItem>
          <ActionMenuItem @click="openDoctorsAppointmentsSidebarPopup(data)">
            <Calendar /> Appointments
          </ActionMenuItem>
          <ActionMenuItem @click="openDoctorsVacationsSidebarPopup(data)">
            <Airplane /> Vacation Requests
          </ActionMenuItem>
          <ActionMenuItem @click="openResetPasswordPopup(data)">
            <Restart /> Reset Password
          </ActionMenuItem>
          <ActionMenuItem severity="danger" @click="openUpdateDoctorStatusPopup(data)">
            <Trash /> Deactivate
          </ActionMenuItem>
        </ActionMenu>
      </template>
    </Column>
    <template #empty>
      <TableSkeleton rows="10" columns="7" v-if="IsDoctorsLoading" />
      <p v-if="isDoctorsError">Something went wrong, please try again.</p>
      <template v-if="!IsDoctorsLoading && !isDoctorsError">
        <p class="text-center m-0">
          No active doctors found.
        </p>
      </template>
    </template>
  </DataTable>
</template>

<style scoped>
::v-deep(.doctor-image) {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
</style>