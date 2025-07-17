<script setup>
import { useField, useForm } from 'vee-validate'
import { markRaw, ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from "primevue/button";
import { useMutation } from '@tanstack/vue-query'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import {registerPatient} from "@/modules/auth/sdk/api.js";

const router = useRouter()
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
  mutationFn: () => registerPatient(values),
  onSuccess: () => {
    router.push({ name: 'login' })
  },
  onError: (error) => {
    loginErrors.value = 'Error registering user. Please try again.'
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
    props: {
      feedback: false,
      toggleMask: true
    }
  }
])

const submit = async () => {
  let isValid = await validate()

  if (!isValid.valid) return

  await mutateAsync()
}

onMounted(() => {
  window.localStorage.removeItem('hmsUser')
})
</script>

<template>
  <div class="login-container d-flex justify-content-center align-items-center vh-100">
    <div class="card login-card p-4 shadow">
      <form class="login-form" @submit.prevent="submit">
        <h1 class="text-center mb-2">Register</h1>
        <p class="text-center text-muted mb-4">Please enter your details to register</p>
        <div class="form-grid">
          <div v-for="field in fields" :key="field.name" class="form-grid__item form-grid__item--full-row">
            <label class="form-grid__label" :for="field.name">{{ field.fieldLabel }}</label>
            <component
                :is="field.component"
                v-model="field.value"
                :id="field.name"
                class="w-100"
                v-bind="field.props"
            />
            <small class="form-grid__error">{{ errors[field.name] }}</small>
          </div>
          <p class="form-grid__item--full-row m-0">Already have an account? Click
            <RouterLink to="/login">here to login</RouterLink>
          </p>
        </div>
        <span v-if="loginErrors && !isPending" class="form-grid__error">
          {{ loginErrors }}
        </span>
        <Button
            @click="submit"
            :loading="isPending"
            class="form-grid__item--full-row mt-4"
            label="Register"
        />
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-card {
  max-width: 650px;
  width: 100%;
  border-radius: 12px;
  background: white;
}

.login-form {
  display: flex;
  flex-direction: column;
}
</style>