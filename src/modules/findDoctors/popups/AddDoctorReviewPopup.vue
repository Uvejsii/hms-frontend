<script setup>
import { markRaw, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {addDoctorReview} from "@/modules/findDoctors/sdk/api.js";
import {useUser} from "@/modules/auth/sdk/user.js";
import {Rating, Textarea} from "primevue";

const visible = ref(true)
const emit = defineEmits(['close'])
const props = defineProps(['data'])
const toast = useToast()
const {user} = useUser()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    doctorId: yup.number().required('Doctor is required'),
    reviewerId: yup.string().required('Reviewer is required'),
    stars: yup.number().min(1).required('Stars are required'),
    comment: yup.string().required('Review comment is required'),
  }),
  initialValues: {
    doctorId: props.data.id,
    reviewerId: user.value?.id,
    stars: 0,
    comment: '',
  }
})

const fields = ref([
  {
    fieldLabel: 'Stars',
    ...useField('stars'),
    component: markRaw(Rating)
  },
  {
    fieldLabel: 'Review comment',
    ...useField('comment'),
    component: markRaw(Textarea),
    props: {
      autoResize: true
    }
  }
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => addDoctorReview(values),
  onSuccess: () => {
    queryClient.invalidateQueries(['doctor', props.data.id])
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Review added Successfully',
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
      :header="`Add review for Dr. ${props.data.firstName} ${props.data.lastName}`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <form @submit="submitForm" class="form-grid">
      <div v-for="field in fields" :key="field.name" class="form-grid__item">
        <label :for="field.name">{{ field.fieldLabel }} {{ field.fieldLabel === 'Stars' ? values.stars : null }}</label>
        <component
            :id="field.name"
            :is="field.component"
            v-model="field.value"
        />
        <small class="form-grid__error">{{ errors[field.name] }}</small>
      </div>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending">{{ isPending ? 'Adding...' : 'Add review' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>