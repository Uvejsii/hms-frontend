<script setup>
import { useField, useForm } from 'vee-validate'
import { markRaw, ref, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from "primevue/button";
import { useMutation } from '@tanstack/vue-query'
import * as yup from 'yup'
import { useUser } from '@/modules/auth/sdk/user.js'
import { useRouter } from 'vue-router'
import {login} from "@/modules/auth/sdk/api.js";

const { user } = useUser()
const router = useRouter()
const loginErrors = ref(null)

const { values, validate, errors } = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Must be valid email').required('Email is required'),
    password: yup.string().required('Password is required')
  }),
  initialValues: {
    email: '',
    password: '',
  },
})

const { mutateAsync, isPending } = useMutation({
  mutationFn: () => login(values),
  onSuccess: (loginResponse) => {
    const userData = {
      ...loginResponse,
    }
    user.value = userData
    window.localStorage.setItem('hmsUser', JSON.stringify(userData))
    if (loginResponse.role === 'Admin') {
      router.push({ name: 'admin-dashboard' })
    } else if (loginResponse.role === 'Doctor') {
      router.push({ name: 'doctor-dashboard' })
    } else {
      router.push({ name: 'home' })
    }
  },
  onError: (error) => {
    loginErrors.value = 'Invalid email or password'
  }
})

const fields = ref([
  {
    fieldLabel: 'Email',
    name: 'email',
    ...useField('email'),
    component: markRaw(InputText)
  },
  {
    fieldLabel: 'Password',
    name: 'password',
    ...useField('password'),
    component: markRaw(Password),
    props: {
      feedback: false,
      toggleMask: true
    }
  },
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
  <div class="login-page">
    <div class="login-image"></div>
    <div class="login-form-container d-flex justify-content-center align-items-center">
      <div class="card login-card p-5 shadow">
        <form class="login-form" @submit.prevent="submit">
          <h1 class="text-center mb-2">Welcome back</h1>
          <p class="text-center text-muted mb-4">Please enter your details to log in</p>
          <div class="form-grid">
            <div v-for="field in fields" :key="field.name" class="form-grid__item form-grid__item--full-row">
              <label class="form-grid__label fw-semibold mb-1" :for="field.name">
                {{ field.fieldLabel }}
              </label>
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
            Don’t have an account?
            <RouterLink to="/register" class="register-link">Register here</RouterLink>
          </p>
          <span v-if="loginErrors && !isPending" class="form-grid__error text-center d-block mt-2">
            {{ loginErrors }}
          </span>
          <Button
              @click="submit"
              :loading="isPending"
              class="w-100 mt-2 modern-btn"
              label="Login"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  height: calc(95vh - var(--header-height));
  width: 100%;
}

.login-image {
  flex: 1;
  background: url('@/assets/login-image-hms.jpeg') no-repeat center center;
  background-size: cover;
}

.login-form-container {
  flex: 1;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 16px;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
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

.register-link {
  font-weight: 600;
  color: #28a745;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline !important;
}
</style>