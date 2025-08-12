<script setup>
import PrimeFileUpload from 'primevue/fileupload'
import {CloudUpload} from "@iconoir/vue";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Buffer } from 'buffer/'
import { ref, inject, onMounted, onUnmounted } from 'vue'
import { useField } from 'vee-validate'
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  fileNamePath: {
    type: String,
    default: ''
  },
  folder: {
    type: String,
    default: 'Offer'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  buttonLabel: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const filesToUpload = inject('filesToUpload')
const { value: fileName } = useField(props.fileNamePath)
let uploadFunction
onMounted(() => {
  uploadFunction = async () => {
    if (selectedFiles.value.length === 0) return []
    try {
      const uploadPromises = selectedFiles.value.map((file) => uploadToS3(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      if (props.multiple) {
        fileName.value = uploadedUrls.map((url) => {
          const urlParts = url.split('.amazonaws.com/')
          return urlParts[1]
        })
      } else {
        fileName.value = uploadedUrls[0].split('.amazonaws.com/')[1]
      }
    } catch (error) {
      throw error
    }
  }

  filesToUpload.value.push(uploadFunction)
})
onUnmounted(() => {
  // Remove the uploadFunction from filesToUpload
  const index = filesToUpload.value.indexOf(uploadFunction)
  if (index !== -1) {
    filesToUpload.value.splice(index, 1)
  }
})

const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
const region = import.meta.env.VITE_AWS_REGION

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
})

const selectedFiles = ref([])

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const uploadToS3 = async (file) => {
  try {
    const base64Data = await fileToBase64(file)
    const base64Content = base64Data.split(',')[1]
    const buffer = Buffer.from(base64Content, 'base64')

    const fileName = `${props.folder}/${Date.now()}-${file.name}`
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: file.type,
      Body: buffer,
      ACL: 'public-read'
    })
    // ACL: null

    await s3Client.send(command)
    const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`
    return fileUrl
  } catch (error) {
    throw error
  }
}

const handleSelect = (event) => {
  selectedFiles.value = event.files
  emit('update:modelValue', event.files)
}

const handleRemove = (event) => {
  selectedFiles.value = selectedFiles.value.filter((file) => file.name !== event.file.name)
  emit('update:modelValue', selectedFiles.value)
}

const handleClear = () => {
  selectedFiles.value = []
  emit('update:modelValue', [])
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return []

  try {
    const uploadPromises = selectedFiles.value.map((file) => uploadToS3(file))
    const uploadedUrls = await Promise.all(uploadPromises)
    return uploadedUrls
  } catch (error) {
    throw error
  }
}

defineExpose({ uploadFiles })
</script>

<template>
  <div class="file-upload">
    <PrimeFileUpload
        mode="advanced"
        :accept="accept"
        :multiple="multiple"
        :maxFileSize="1000000"
        :customUpload="true"
        :auto="false"
        @select="handleSelect"
        @remove="handleRemove"
        @clear="handleClear"
        :showUploadButton="false"
        :chooseLabel="
        buttonLabel || 'Select image'
      "
    >
      <template #empty>
        <div class="file-upload__empty">
          <CloudUpload />
          <p>Drag and drop file to upload</p>
        </div>
      </template>
    </PrimeFileUpload>
  </div>
</template>

<style>
.file-upload {
  .p-fileupload-advanced {
    border: 1px solid #d2cfcf;
  }
}

.file-upload__empty {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
</style>
