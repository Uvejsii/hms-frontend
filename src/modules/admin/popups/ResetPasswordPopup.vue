<script setup>
import { markRaw, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {InputText} from "primevue";
import {addDepartment, resetPasswordByEmail} from "@/modules/admin/sdk/api.js";

const visible = ref(true)
const emit = defineEmits(['close'])
const props = defineProps(['data'])
const toast = useToast()

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    email: yup.string().required('Email is required'),
  }),
  initialValues: {
    email: props.data.email,
  }
})

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => resetPasswordByEmail(values),
  onSuccess: () => {
    queryClient.invalidateQueries(['departments-active'])
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Password reset successfully',
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
      header="Reset Password"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <div>
      <p>Are you sure you want to reset password for <b>{{ props.data.email }}</b>?</p>
    </div>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending">
        {{ isPending ? 'Resetting...' : 'Reset' }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped></style>