<script setup>
import {computed, markRaw, ref, watch} from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import {useMutation, useQuery, useQueryClient} from '@tanstack/vue-query'
import {bookAppointment, getAvailableAppointments} from "@/modules/findDoctors/sdk/api.js";
import {useUser} from "@/modules/auth/sdk/user.js";
import {DatePicker, Select, Textarea} from "primevue";
import InputText from "primevue/inputtext";
import moment from "moment";
import {CalendarPlus} from "@iconoir/vue";

const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()
const {user} = useUser()

const { validate, errors, values, setFieldValue } = useForm({
  validationSchema: yup.object({
    date: yup.date().required('Date is required'),
    notes: yup.string().required('Notes is required'),
    startTime: yup
        .string()
        .required('Start time is required'),
    endTime: yup
        .string()
        .required('End time is required')
        .test('is-30min-after-start', 'End time must be exactly 30 minutes after start time', function (endTime) {
          const { startTime } = this.parent;
          if (!startTime || !endTime) return true;

          const start = moment(startTime);
          const end = moment(endTime);

          return end.diff(start, 'minutes') === 30;
        }),
    price: yup.number().required('Price is required'),
    contactPhoneNumber: yup.string().required('Phone number is required'),
    doctorId: yup.number().required('Doctor is required'),
    userId: yup.string().required('User is required'),
  }),
  initialValues: {
    date: new Date(),
    notes: '',
    startTime: null,
    endTime: null,
    price: props.data.consultationFee,
    contactPhoneNumber: '',
    doctorId: props.data.id,
    userId: user.value?.id,
  }
})

const today = moment().format('D')

const drAvailabilityKey = computed(() => ['doctorAvailability', props.data.id]);
const { data, isLoading, refetch } = useQuery({
  queryKey: drAvailabilityKey,
  queryFn: () => getAvailableAppointments(props.data.id, values.date ? moment(values.date).format('D') : today),
});

watch(() => values.date, (newDate) => {
  if (newDate) {
    refetch()
    setFieldValue('startTime', null)
    setFieldValue('endTime', null)
  }
})

const startTimeOptions = computed(() => {
  return data?.value?.map((d) => ({
    label: moment(d.start).format('HH:mm'),
    value: d.start,
  })) || [];
});

const endTimeOptions = computed(() => {
  return data?.value?.map((d) => ({
    label: moment(d.end).format('HH:mm'),
    value: d.end,
  })) || [];
});

const fields = ref([
  {
    fieldLabel: 'Select Date',
    ...useField('date'),
    component: markRaw(DatePicker),
    props: {
      minDate: new Date(),
      showIcon: true,
    }
  },
  {
    fieldLabel: 'Start time',
    ...useField('startTime'),
    component: markRaw(Select),
    props: {
      options: startTimeOptions,
      optionLabel: 'label',
      optionValue: 'value',
      placeholder: 'Select start time',
    }
  },
  {
    fieldLabel: 'End time',
    ...useField('endTime'),
    component: markRaw(Select),
    props: {
      options: endTimeOptions,
      optionLabel: 'label',
      optionValue: 'value',
      placeholder: 'Select end time',
    }
  },
  {
    fieldLabel: 'Phone number',
    ...useField('contactPhoneNumber'),
    component: markRaw(InputText),
    props: {
      placeholder: 'Enter your phone number',
    }
  },
  {
    fieldLabel: 'Notes',
    ...useField('notes'),
    component: markRaw(Textarea),
    props: {
      autoResize: true,
      placeholder: 'Reason of appointment or special requests',
    }
  },
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => bookAppointment(values),
  onSuccess: () => {
    queryClient.invalidateQueries(drAvailabilityKey.value)
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Appointment booked',
      life: 5000
    })
  },
  onError: (error) => {
    toast.add({
      severity: 'error',
      summary: 'Something went wrong',
      detail: `Please try again. ${error.message}`,
      life: 5000
    })
  }
})

const submitForm = async () => {
  const isValid = await validate()

  if (isValid.valid) {
    mutate()
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
      :header="`Book appointment with Dr. ${props.data.firstName} ${props.data.lastName}`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <form @submit="submitForm" class="form-grid">
      <div v-for="field in fields" :key="field.name" class="form-grid__item">
        <label :for="field.name">{{ field.fieldLabel }}</label>
        <component
            :id="field.name"
            :is="field.component"
            v-model="field.value"
            v-bind="field.props"
        />
        <small class="form-grid__error">{{ errors[field.name] }}</small>
      </div>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending"><CalendarPlus/>{{ isPending ? 'Booking...' : 'Book' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>