<script setup>
import {computed, markRaw, ref, watch} from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import {useMutation, useQuery, useQueryClient} from '@tanstack/vue-query'
import {DatePicker} from "primevue";
import {useUser} from "@/modules/auth/sdk/user.js";
import {checkIfVacationExists, requestVacation} from "@/modules/doctor/sdk/api.js";

const { user } = useUser()
const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    doctorId: yup.string().required('Doctor is required'),
    vacationType: yup.string().required('Vacation Type is required'),
    startDate: yup.string().required('Start date is required'),
    endDate: yup.string().required('End date is required')
        .test('end-after-start', 'End date cannot be before start date', function (value) {
          const { startDate } = this.parent
          if (!startDate || !value) return true
          return new Date(value) >= new Date(startDate)
        }),
  }),
  initialValues: {
    doctorId: Number(user.value?.doctorId),
    vacationType: props.data.vacationType,
    startDate: null,
    endDate: null,
  }
})

const endDateMinDate = computed(() => {
  return values.startDate ? new Date(values.startDate) : new Date();
});

const fields = ref([
  {
    fieldLabel: 'Start Date',
    ...useField('startDate'),
    component: markRaw(DatePicker),
    props: {
      placeholder: 'Select date',
      showIcon: true,
      minDate: new Date(),
    }
  },
  {
    fieldLabel: 'End Date',
    ...useField('endDate'),
    component: markRaw(DatePicker),
    props: {
      placeholder: 'Select date',
      showIcon: true,
      get minDate() {
        return endDateMinDate.value;
      }
    }
  },
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => requestVacation(values),
  onSuccess: () => {
    queryClient.invalidateQueries( ['total-vacation', Number(user.value.doctorId)])
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Vacation Request Made Successfully',
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

const { data, isLoading, refetch } = useQuery({
  queryKey: ['vacation-check', Number(user.value.doctorId)],
  queryFn: () => checkIfVacationExists(Number(user.value.doctorId), values.startDate, values.endDate),
  enabled: false
})

watch(
    () => [values.startDate, values.endDate],
    ([start, end]) => {
      if (start && end) {
        refetch()
      }
    }
)

const submitForm = async () => {
  const isValid = await validate()
  if (!isValid.valid) return

  if (data.value === true) {
    toast.add({
      severity: 'warn',
      summary: 'Vacation Conflict',
      detail: 'You already have a vacation during this time range.',
      life: 3000
    })
    return
  }

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


const popupTitle = computed(() => {
  return props.data.vacationType === 0 ? 'Request for Vacation'
      : (props.data.vacationType === 1 ? 'Request for Sick Leave' : 'Request for Unpaid Leave')
})

const cancel = () => {
  emit('close', null)
}
</script>

<template>
  <Dialog
      style="width: 668px"
      @hide="cancel"
      :header="popupTitle"
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
      <small v-if="data === true" class="form-grid__error">
        A vacation already exists in this date range.
      </small>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending || isLoading">
        {{ isPending ? 'Requesting...' : 'Request' }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped></style>