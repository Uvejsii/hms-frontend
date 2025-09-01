<script setup>
import {markRaw, ref} from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {updateVacationRequest} from "@/modules/admin/sdk/api.js";
import {useField, useForm} from "vee-validate";
import * as yup from "yup";
import {Select} from "primevue";

const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()

const { values, validate, errors } = useForm({
  validationSchema: yup.object({
    vacationId: yup.string().required('Vacation is required'),
    status: yup.boolean().required('Status is required'),
  }),
  initialValues: {
    vacationId: props.data.id,
    status: props.data.isApproved,
  },
})

const fields = ref([
  {
    fieldLabel: 'Status',
    ...useField('status'),
    component: markRaw(Select),
    props: {
      placeholder: 'Select Status',
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      optionLabel: 'label',
      optionValue: 'value',
    },
  },
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => updateVacationRequest(values.vacationId, values.status),
  onSuccess: () => {
    queryClient.invalidateQueries(props.data.revalidateKey)
    emit('close', true)
    toast.add({
      severity: 'success',
      summary: 'Vacation Status Updated Successfully',
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

const cancel = () => {
  emit('close', null)
}

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
</script>

<template>
  <Dialog
      style="width: 568px"
      @hide="cancel"
      :header="`Approve or Reject Vacation Request`"
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
      <Button @click="submitForm" :disabled="isPending" severity="primary">
        {{ isPending ? 'Updating...' : 'Update' }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped></style>