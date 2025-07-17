<script setup>
import { markRaw, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {editDoctorReview} from "@/modules/findDoctors/sdk/api.js";
import {Rating, Textarea} from "primevue";

const visible = ref(true)
const emit = defineEmits(['close'])
const props = defineProps(['data'])
const toast = useToast()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    doctorId: yup.number().required('Doctor is required'),
    stars: yup.string().required('Stars are required'),
    comment: yup.string().required('Review comment is required'),
  }),
  initialValues: {
    id: props.data.id,
    doctorId:  props.data.doctorId,
    stars: props.data.stars,
    comment: props.data.comment,
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
  mutationFn: () => editDoctorReview(values),
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
      header="Edit review"
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
            v-bind="field.props"
        />
        <small class="form-grid__error">{{ errors[field.name] }}</small>
      </div>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending">{{ isPending ? 'Editing...' : 'Edit review' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>