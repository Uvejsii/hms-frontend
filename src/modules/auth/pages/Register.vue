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
    component: markRaw(InputText),
  },
  {
    fieldLabel: 'Last name',
    ...useField('lastName'),
    component: markRaw(InputText)
  },
  {
    fieldLabel: 'Email',
    ...useField('email'),
    component: markRaw(InputText),
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
  <div class="register-page">
    <!-- Left side hospital image -->
    <div class="register-image"></div>

    <!-- Right side with form -->
    <div class="register-form-container d-flex justify-content-center align-items-center">
      <div class="card register-card p-5 shadow">
        <form class="register-form" @submit.prevent="submit">
          <h1 class="text-center mb-2">Create an account</h1>
          <p class="text-center text-muted mb-4">Join our hospital system and manage your health better</p>

          <div class="form-grid">
            <div v-for="field in fields" :key="field.name" class="form-grid__item" :class="field.classes">
              <label class="form-grid__label fw-semibold mb-1" :for="field.name">{{ field.fieldLabel }}</label>
              <component
                  :is="field.component"
                  v-model="field.value"
                  :id="field.name"
                  class="w-100"
                  v-bind="field.props"
              />
              <small class="form-grid__error">{{ errors[field.name] }}</small>
            </div>
          </div>

          <p class="text-center mt-3">
            Already have an account?
            <RouterLink to="/login" class="login-link">Login here</RouterLink>
          </p>

          <span v-if="loginErrors && !isPending" class="form-grid__error text-center d-block mt-2">
            {{ loginErrors }}
          </span>

          <Button
              @click="submit"
              :loading="isPending"
              class="w-100 mt-4 modern-btn"
              label="Register"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  height: calc(95vh - var(--header-height));
  width: 100%;
}

.register-image {
  flex: 1;
  background: url("@/assets/login-image-hms.jpeg") no-repeat center center;
  background-size: cover;
}

.register-form-container {
  flex: 1;
}

.register-card {
  width: 100%;
  max-width: 550px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-grid__label {
  font-size: 0.9rem;
  color: #333;
}

.form-grid__error {
  font-size: 0.8rem;
  color: #e74c3c;
}

.login-link {
  font-weight: 600;
  color: #007bff;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline !important;
}
</style>