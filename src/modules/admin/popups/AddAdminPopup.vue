<script setup>
import { markRaw, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {InputText} from "primevue";
import Password from "primevue/password";
import {registerAdmin} from "@/modules/admin/sdk/api.js";

const visible = ref(true)
const emit = defineEmits(['close'])
const toast = useToast()
const queryClient = useQueryClient()

const loginErrors = ref(null)
const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/

const { values, validate, errors } = useForm({
  validationSchema: yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Must be valid email').required('Email is required'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(
            passwordRules,
            'Password must contain uppercase, lowercase, number, and symbol'
        ),
    confirmPassword: yup
        .string()
        .required('Confirm Password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
  }),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
})

const { mutateAsync, isPending } = useMutation({
  mutationFn: () => registerAdmin(values),
  onSuccess: () => {
    queryClient.invalidateQueries(['admins'])
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Admin Registered Successfully',
      life: 3000
    })
  },
  onError: (error) => {
    loginErrors.value = 'Error registering admin. Please try again.'
    toast.add({
      severity: 'error',
      summary: 'Something went wrong',
      detail: `Please try again. ${error.message}`,
      life: 3000
    })
  }
})

const fields = ref([
  {
    fieldLabel: 'First name',
    ...useField('firstName'),
    component: markRaw(InputText)
  },
  {
    fieldLabel: 'Last name',
    ...useField('lastName'),
    component: markRaw(InputText)
  },
  {
    fieldLabel: 'Email',
    ...useField('email'),
    component: markRaw(InputText)
  },
  {
    fieldLabel: 'Password',
    ...useField('password'),
    component: markRaw(Password),
    props: {
      feedback: false,
      toggleMask: true
    }
  },
  {
    fieldLabel: 'Confirm password',
    ...useField('confirmPassword'),
    component: markRaw(Password),
    classes: 'form-grid__item--full-row',
    props: {
      feedback: false,
      toggleMask: true
    }
  }
])

const submitForm = async () => {
  let isValid = await validate()

  if (!isValid.valid) return

  await mutateAsync()
}

const cancel = () => {
  emit('close', null)
}
</script>

<template>
  <Dialog
      style="width: 668px"
      @hide="cancel"
      header="Register Admin"
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
      <span v-if="loginErrors && !isPending" class="form-grid__error">
          {{ loginErrors }}
      </span>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending">
        {{ isPending ? 'Registering...' : 'Register Admin' }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped></style>