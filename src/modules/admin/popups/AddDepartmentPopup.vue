<script setup>
import { markRaw, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {InputText} from "primevue";
import {addDepartment} from "@/modules/admin/sdk/api.js";

const visible = ref(true)
const emit = defineEmits(['close'])
const toast = useToast()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    name: yup.string().required('Department name is required'),
    location: yup.string().required('Location is required'),
  }),
  initialValues: {
    name: '',
    location: '',
  }
})

const fields = ref([
  {
    fieldLabel: 'Name',
    ...useField('name'),
    component: markRaw(InputText),
    props: {
      placeholder: 'Neurology'
    }
  },
  {
    fieldLabel: 'Location',
    ...useField('location'),
    component: markRaw(InputText),
    props: {
      placeholder: 'Building Z, 1st Floor'
    }
  },
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => addDepartment(values),
  onSuccess: () => {
    queryClient.invalidateQueries(['departments-active'])
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Department Added Successfully',
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
      header="Add Department"
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
      <Button @click="submitForm" :disabled="isPending">{{ isPending ? 'Adding...' : 'Add Department' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>