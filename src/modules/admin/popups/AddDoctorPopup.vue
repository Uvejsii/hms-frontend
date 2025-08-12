<script setup>
import { markRaw, ref, provide } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {InputText, InputNumber} from "primevue";
import {addDoctor} from "@/modules/admin/sdk/api.js";
import DepartmentSelect from "@/modules/admin/fields/DepartmentSelect.vue";
import FileUpload from "@/components/FileUpload.vue";
import LanguagesSelect from "@/modules/admin/fields/LanguagesSelect.vue";

const visible = ref(true)
const emit = defineEmits(['close'])
const toast = useToast()

const filesToUpload = ref([])
provide('filesToUpload', filesToUpload)

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().required('Email is required'),
    yearsOfExperience: yup.number().min(1).required('Experience is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    consultationFee: yup.number().min(15).required('Consultation fee is required'),
    isAvailable: yup.boolean().default(true).required('Availability is required'),
    departamentId: yup.number().required('Department is required'),
    languages: yup.array().required('Languages is required'),
  }),
  initialValues: {
    firstName: '',
    lastName: '',
    email: '',
    yearsOfExperience: null,
    phoneNumber: '',
    consultationFee: null,
    isAvailable: true,
    departamentId: null,
    imageFileUrl: [],
    languages: []
  }
})

const fields = ref([
  {
    fieldLabel: 'First Name',
    ...useField('firstName'),
    component: markRaw(InputText),
    props: {
      placeholder: 'John'
    }
  },
  {
    fieldLabel: 'Last Name',
    ...useField('lastName'),
    component: markRaw(InputText),
    props: {
      placeholder: 'Doe'
    }
  },
  {
    fieldLabel: 'Email',
    ...useField('email'),
    component: markRaw(InputText),
    props: {
      placeholder: 'johndoe@gmail.com'
    }
  },
  {
    fieldLabel: 'Phone Number',
    ...useField('phoneNumber'),
    component: markRaw(InputText),
    props: {
      placeholder: '+38344290378'
    }
  },
  {
    fieldLabel: 'Experience (Years)',
    ...useField('yearsOfExperience'),
    component: markRaw(InputNumber),
    props: {
      placeholder: '5'
    }
  },
  {
    fieldLabel: 'Consultation Fee',
    ...useField('consultationFee'),
    component: markRaw(InputNumber),
    props: {
      placeholder: '40.00',
      mode: 'currency',
      currency: 'EUR',
      locale: 'de-DE',
    }
  },
  {
    fieldLabel: 'Department',
    ...useField('departamentId'),
    component: markRaw(DepartmentSelect),
  },
  {
    fieldLabel: 'Languages',
    ...useField('languages'),
    component: markRaw(LanguagesSelect),
    props: {
      placeholder: 'Languages'
    }
  },
  {
    fieldLabel: 'Image URL',
    ...useField('imageFileUrl'),
    component: markRaw(FileUpload),
    classes: 'form-grid__item--full-row',
    props: {
      fileNamePath: 'fileUrls',
      folder: 'DrImages',
    }
  }
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: (payload) => addDoctor(payload),
  onSuccess: () => {
    queryClient.invalidateQueries(['doctors'])
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Doctor Added Successfully',
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
    await Promise.all(filesToUpload.value.map((uploadFn) => uploadFn()))
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      yearsOfExperience: values.yearsOfExperience,
      phoneNumber: values.phoneNumber,
      consultationFee: values.consultationFee,
      isAvailable: values.isAvailable,
      departamentId: values.departamentId,
      imageFileUrl: values.fileUrls?.[0] || null,
      languages: values.languages.join(', ')
    }

    mutate(payload)
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
      header="Add Doctor"
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
      <Button @click="submitForm" :disabled="isPending">{{ isPending ? 'Adding...' : 'Add Doctor' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>