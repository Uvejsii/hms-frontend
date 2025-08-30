<script setup>
import { markRaw, ref } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation } from '@tanstack/vue-query'
import {changePassword} from "@/modules/auth/sdk/api.js";
import Password from "primevue/password";
import { useUser } from "@/modules/auth/sdk/user.js";

const visible = ref(true)
const emit = defineEmits(['close'])
const toast = useToast()
const { user } = useUser()

const pswErrors = ref(null)
const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/

const { values, validate, errors } = useForm({
  validationSchema: yup.object({
    email: yup.string().email('Must be valid email').required('Email is required'),
    oldPassword: yup
        .string()
        .required('Old password is required'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(6, 'New password must be at least 6 characters')
        .matches(
            passwordRules,
            'New password must contain uppercase, lowercase, number, and symbol'
        ).test(
            'not-same-as-old',
            'New password must be different from old password',
            function (value) {
              const { oldPassword } = this.parent;
              return value !== oldPassword;
            }
        ),
  }),
  initialValues: {
    email: user.value?.email,
    oldPassword: '',
    newPassword: '',
  },
})

const { mutateAsync, isPending } = useMutation({
  mutationFn: () => changePassword(values),
  onSuccess: () => {
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Password Changed Successfully',
      life: 3000
    })
  },
  onError: (error) => {
    pswErrors.value = 'Error changing password. Please try again.'
    toast.add({
      severity: 'error',
      summary: 'Something went wrong',
      detail: `Please try again.`,
      life: 3000
    })
  }
})

const fields = ref([
  {
    fieldLabel: 'Old password',
    ...useField('oldPassword'),
    component: markRaw(Password),
    classes: 'form-grid__item--full-row',
    props: {
      feedback: false,
      toggleMask: true
    }
  },
  {
    fieldLabel: 'New password',
    ...useField('newPassword'),
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
      style="width: 410px"
      @hide="cancel"
      header="Change Password"
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
      <span v-if="pswErrors && !isPending" class="form-grid__error">
          {{ pswErrors }}
      </span>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending">{{ isPending ? 'Changing...' : 'Change password' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>