<script setup>
import { markRaw, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {Select} from "primevue";
import {editAppointmentStatus} from "@/modules/admin/pages/appointments/sdk/api.js";

const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    bookingId: yup.string().required('Appointment id is required'),
    bookingStatus: yup.string().required('Appointment status is required'),
  }),
  initialValues: {
    bookingId: props.data.extendedProps.bookingId,
    bookingStatus: props.data.extendedProps.status,
  }
})

const fields = ref([
  {
    fieldLabel: 'Appointment status',
    ...useField('bookingStatus'),
    component: markRaw(Select),
    props: {
      placeholder: 'Select Status',
      options: [
        { label: 'Pending', value: 0 },
        { label: 'Confirmed', value: 1 },
        { label: 'Ongoing', value: 2 },
        { label: 'Finished', value: 3 },
        { label: 'Cancelled', value: 4 },
      ],
      optionLabel: 'label',
      optionValue: 'value',
    },
  },
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => editAppointmentStatus(values),
  onSuccess: () => {
    queryClient.invalidateQueries(props.data.revalidateKey)
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Status Updated Successfully',
      life: 3000
    })
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Something went wrong',
      detail: `Please try again. ${error.message}`,
      life: 3000
    })
  }
})

const submitForm = async () => {
  const isValid = await validate()

  if (!isValid.valid) return
  try {
    mutate()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Something went wrong',
      detail: `Please try again. ${e.message}`,
      life: 3000
    })
    console.error(e)
  }
}

const cancel = () => {
  emit('close', null)
}
</script>

<template>
  <Dialog
      style="width: 668px"
      @hide="cancel"
      :header="`Edit Appointment Status for ${ props.data.extendedProps.user }`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <form @submit="submitForm" class="form-grid">
      <div v-for="field in fields" :key="field.name" class="form-grid__item" :class="field.classes">
        <label :for="field.name">{{ field.fieldLabel }}</label>
        <component
            :id="field.name"
            :is="field.component"
            v-bind="field.props"
            v-model="field.value"
        />
        <small class="form-grid__error">{{ errors[field.name] }}</small>
      </div>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending">{{ isPending ? 'Editing...' : 'Edit Status' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>