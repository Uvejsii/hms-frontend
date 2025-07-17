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
