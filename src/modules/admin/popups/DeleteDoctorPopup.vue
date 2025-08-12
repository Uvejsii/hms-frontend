<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {deleteDoctor} from "@/modules/admin/sdk/api.js";

const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => deleteDoctor(props.data.id),
  onSuccess: () => {
    queryClient.invalidateQueries(['doctors'])
    emit('close', true)
    toast.add({
      severity: 'success',
      summary: 'Doctor Deleted Successfully',
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

const cancel = () => {
  emit('close', null)
}
</script>

<template>
  <Dialog
      style="width: 468px"
      @hide="cancel"
      header="Delete doctor"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <div>
      <p>Are you sure you want to delete <strong>Dr. {{ props.data.firstName }} {{ props.data.lastName }}</strong>?</p>
    </div>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="mutate" :disabled="isPending" severity="danger">
        {{ isPending ? 'Deleting...' : 'Delete Doctor' }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped></style>