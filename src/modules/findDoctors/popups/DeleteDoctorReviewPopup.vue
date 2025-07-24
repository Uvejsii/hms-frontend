<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {deleteDoctorReview} from "@/modules/findDoctors/sdk/api.js";

const visible = ref(true)
const emit = defineEmits(['close'])
const props = defineProps(['data'])
const toast = useToast()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    doctorId: yup.number().required('Doctor is required'),
    reviewId: yup.string().required('Review is required'),
  }),
  initialValues: {
    doctorId: props.data.doctorId,
    reviewId: props.data.id,
  }
})

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => deleteDoctorReview(values),
  onSuccess: () => {
    queryClient.invalidateQueries(props.data.drKey)
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Review deleted Successfully',
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
      header="Delete review"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <div>
      <p class="m-0">Review: <b>{{ props.data.comment }}</b></p>
    </div>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending" severity="danger">
        {{ isPending ? 'Deleting...' : 'Delete review' }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped></style>