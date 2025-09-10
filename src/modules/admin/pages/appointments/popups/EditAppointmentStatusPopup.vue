<script setup>
import {markRaw, ref, watch} from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {editAppointmentStatus} from "@/modules/admin/pages/appointments/sdk/api.js";

const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    bookingId: yup.string().required('Appointment id is required'),
    bookingStatus: yup.string().required('Appointment status is required'),
    bookingPrescription: yup.string().when('bookingStatus', {
      is: 3,
      then: (schema) => schema.required('Prescription is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  initialValues: {
    bookingId: props.data.extendedProps.bookingId,
    bookingStatus: props.data.extendedProps.status,
    bookingPrescription: props.data.extendedProps.bookingPerscription || '',
  }
})

const { value: bookingStatus } = useField('bookingStatus');
const { value: bookingPrescription } = useField('bookingPrescription');

const fields = ref([
  {
    name: 'bookingStatus',
    fieldLabel: 'Appointment status',
    value: bookingStatus,
    component: markRaw(Select),
    classes: 'form-grid__item--full-row',
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

watch(bookingStatus, async (newValue) => {
  const hasPrescriptionField = fields.value.some(field => field.name === 'bookingPrescription');
  if (newValue === 3 && !hasPrescriptionField) {
    fields.value.push({
      name: 'bookingPrescription',
      fieldLabel: 'Prescription',
      value: bookingPrescription,
      component: markRaw(Textarea),
      classes: 'form-grid__item--full-row',
      props: {
        placeholder: 'Enter prescription notes...',
        rows: 5,
        autoResize: true,
      },
    });
  } else if (newValue !== 3 && hasPrescriptionField) {
    fields.value = fields.value.filter(field => field.name !== 'bookingPrescription');
  }

  await validate();
}, { immediate: true });

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