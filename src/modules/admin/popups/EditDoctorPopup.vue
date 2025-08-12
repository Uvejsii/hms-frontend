<script setup>
import { markRaw, ref, provide } from 'vue'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {InputText, InputNumber} from "primevue";
import {addDoctor, editDoctor} from "@/modules/admin/sdk/api.js";
import DepartmentSelect from "@/modules/admin/fields/DepartmentSelect.vue";
import FileUpload from "@/components/FileUpload.vue";
import ImagePreview from "@/modules/admin/fields/ImagePreview.vue";
import LanguagesSelect from "@/modules/admin/fields/LanguagesSelect.vue";

const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()

const filesToUpload = ref([])
provide('filesToUpload', filesToUpload)

const { validate, errors, values } = useForm({
  validationSchema: yup.object({
    id: yup.string().required('Doctor id is required'),
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
    id: props.data.id,
    firstName: props.data.firstName,
    lastName: props.data.lastName,
    email: props.data.email,
    yearsOfExperience: props.data.yearsOfExperience,
    phoneNumber: props.data.phoneNumber,
    consultationFee: props.data.consultationFee,
    isAvailable: props.data.isAvailable,
    departamentId: props.data.departament.id,
    imageFileUrl: [],
    languages: props.data.languages.split(', ')
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
      placeholder: 'johndoe@gmail.com',
      disabled: true,
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
    fieldLabel: 'Image',
    classes: 'form-grid__item--full-row',
    children: [
      {
        component: markRaw(ImagePreview),
        classes: 'form-grid__item--full-row',
        props: {
          imageUrl: props.data.imageFilePath,
          altText: 'Doctor Image',
        }
      },
      {
        ...useField('imageFileUrl'),
        component: markRaw(FileUpload),
        props: {
          fileNamePath: 'fileUrls',
          folder: 'DrImages',
        }
      }
    ]
  }
])

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: (payload) => editDoctor(payload),
  onSuccess: () => {
    queryClient.invalidateQueries(['doctors'])
    emit('close', values)
    toast.add({
      severity: 'success',
      summary: 'Doctor Updated Successfully',
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
      id: values.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      yearsOfExperience: values.yearsOfExperience,
      phoneNumber: values.phoneNumber,
      consultationFee: values.consultationFee,
      isAvailable: values.isAvailable,
      departamentId: values.departamentId,
      imageFilePath: values.fileUrls?.[0] || null,
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
      :header="`Edit Dr. ${props.data.firstName} ${props.data.lastName}`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <form @submit="submitForm" class="form-grid">
      <div v-for="field in fields" :key="field.name" class="form-grid__item" :class="field.classes">
        <label :for="field.name">{{ field.fieldLabel }}</label>
        <component
            v-if="field.name"
            :id="field.name"
            :is="field.component"
            v-bind="field.props"
            v-model="field.value"
        />
        <div v-else class="form-grid__item-nested">
          <div v-for="field in field.children" :key="field.name" :class="field.classes">
            <component v-model="field.value" :is="field.component" v-bind="field.props" />
            <small class="form-grid__error">{{ errors[field.name] }}</small>
          </div>
        </div>
        <small class="form-grid__error">{{ errors[field.name] }}</small>
      </div>
    </form>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="submitForm" :disabled="isPending">{{ isPending ? 'Editing...' : 'Edit Doctor' }}</Button>
    </template>
  </Dialog>
</template>

<style scoped></style>