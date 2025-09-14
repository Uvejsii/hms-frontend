<script setup>
import { defineAsyncComponent, reactive, provide, markRaw } from 'vue'

function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const DoctorDetailsPopup = defineAsyncComponent(
    () => import('@/modules/findDoctors/popups/DoctorsDetailsPopup.vue')
)
const AddDoctorReviewPopup = defineAsyncComponent(
    () => import('@/modules/findDoctors/popups/AddDoctorReviewPopup.vue')
)
const EditDoctorReviewPopup = defineAsyncComponent(
    () => import('@/modules/findDoctors/popups/EditDoctorReviewPopup.vue')
)
const DeleteDoctorReviewPopup = defineAsyncComponent(
    () => import('@/modules/findDoctors/popups/DeleteDoctorReviewPopup.vue')
)
const BookAppointmentPopup = defineAsyncComponent(
    () => import('@/modules/findDoctors/popups/BookAppointmentPopup.vue')
)
const AddDoctorPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/AddDoctorPopup.vue')
)
const EditDoctorPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/EditDoctorPopup.vue')
)
const UpdateDoctorStatusPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/UpdateDoctorStatusPopup.vue')
)
const AddDepartmentPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/AddDepartmentPopup.vue')
)
const EditDepartmentPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/EditDepartmentPopup.vue')
)
const UpdateDepartmentStatusPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/UpdateDepartmentStatusPopup.vue')
)
const PatientAppointmentsSidebarPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/PatientAppointmentsSidebarPopup.vue')
)
const ResetPasswordPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/ResetPasswordPopup.vue')
)
const AddPatientPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/AddPatientPopup.vue')
)
const DoctorsAppointmentsSidebarPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/DoctorsAppointmentsSidebarPopup.vue')
)
const ChangePasswordPopup = defineAsyncComponent(
    () => import('@/modules/auth/popups/ChangePasswordPopup.vue')
)
const DoctorsVacationsSidebarPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/DoctorsVacationsSidebarPopup.vue')
)
const UpdateVacationStatusPopup = defineAsyncComponent(
    () => import('@/modules/admin/popups/UpdateVacationStatusPopup.vue')
)
const EditAppointmentStatusPopup = defineAsyncComponent(
    () => import('@/modules/admin/pages/appointments/popups/EditAppointmentStatusPopup.vue')
)
const RequestVacationPopup = defineAsyncComponent(
    () => import('@/modules/doctor/popups/RequestVacationPopup.vue')
)

const popups = reactive([])

const showPopup = (popup, data) => {
  const newPopup = {
    id: generateGUID(),
    popup: markRaw(popup),
    data
  }

  let resolvePromise
  const promise = new Promise((resolve) => {
    resolvePromise = resolve
  })

  newPopup.promiseResolver = resolvePromise

  popups.push(newPopup)

  return promise
}

function closePopup(popup, data) {
  const index = popups.findIndex((p) => p.id === popup.id)
  if (index !== -1) {
    popup.promiseResolver(data)

    setTimeout(() => {
      popups.splice(index, 1)
    }, 10)
  }
}

provide('showDoctorDetailsPopup', (data) => showPopup(markRaw(DoctorDetailsPopup), data))
provide('showAddDoctorReviewPopup', (data) => showPopup(markRaw(AddDoctorReviewPopup), data))
provide('showEditDoctorReviewPopup', (data) => showPopup(markRaw(EditDoctorReviewPopup), data))
provide('showDeleteDoctorReviewPopup', (data) => showPopup(markRaw(DeleteDoctorReviewPopup), data))
provide('showBookAppointmentPopup', (data) => showPopup(markRaw(BookAppointmentPopup), data))
provide('showAddDoctorPopup', (data) => showPopup(markRaw(AddDoctorPopup), data))
provide('showEditDoctorPopup', (data) => showPopup(markRaw(EditDoctorPopup), data))
provide('showUpdateDoctorStatusPopup', (data) => showPopup(markRaw(UpdateDoctorStatusPopup), data))
provide('showAddDepartmentPopup', (data) => showPopup(markRaw(AddDepartmentPopup), data))
provide('showEditDepartmentPopup', (data) => showPopup(markRaw(EditDepartmentPopup), data))
provide('showUpdateDepartmentStatusPopup', (data) => showPopup(markRaw(UpdateDepartmentStatusPopup), data))
provide('showPatientAppointmentsSidebarPopup', (data) => showPopup(markRaw(PatientAppointmentsSidebarPopup), data))
provide('showResetPasswordPopup', (data) => showPopup(markRaw(ResetPasswordPopup), data))
provide('showAddPatientPopup', (data) => showPopup(markRaw(AddPatientPopup), data))
provide('showDoctorsAppointmentsSidebarPopup', (data) => showPopup(markRaw(DoctorsAppointmentsSidebarPopup), data))
provide('showChangePasswordPopup', (data) => showPopup(markRaw(ChangePasswordPopup), data))
provide('showDoctorsVacationsSidebarPopup', (data) => showPopup(markRaw(DoctorsVacationsSidebarPopup), data))
provide('showUpdateVacationStatusPopup', (data) => showPopup(markRaw(UpdateVacationStatusPopup), data))
provide('showEditAppointmentStatusPopup', (data) => showPopup(markRaw(EditAppointmentStatusPopup), data))
provide('showRequestVacationPopup', (data) => showPopup(markRaw(RequestVacationPopup), data))
</script>

<template>
  <div class="popups">
    <template v-for="(popup, idx) in popups" :key="popup.id">
      <component
          :is="popup.popup"
          :data="popup.data"
          :class="`popup--${idx}`"
          :is-last="idx === popups.length - 1"
          :style="{ opacity: idx === popups.length - 1 ? 1 : 0 }"
          @close="(data) => closePopup(popup, data)"
      />
    </template>
    <slot />
  </div>
</template>
