<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {editDepartmentStatus} from "@/modules/admin/sdk/api.js";

const visible = ref(true)
const props = defineProps(['data'])
const emit = defineEmits(['close'])
const toast = useToast()

const queryClient = useQueryClient()
const { mutate, isPending } = useMutation({
  mutationFn: () => editDepartmentStatus(props.data.id, !props.data.isActive),
  onSuccess: () => {
    queryClient.invalidateQueries(props.data.revalidateKey)
    emit('close', true)
    toast.add({
      severity: 'success',
      summary: 'Department Status Updated Successfully',
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
      style="width: 568px"
      @hide="cancel"
      :header="`${props.data.isActive ? 'Deactivate' : 'Activate'} department`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <div>
      <p>Are you sure you want to {{ props.data.isActive ? 'deactivate' : 'activate' }}
        <strong> {{ props.data.name }}</strong>?
      </p>
    </div>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
      <Button @click="mutate" :disabled="isPending" :severity="props.data.isActive ? 'danger' : 'primary'">
        {{ isPending ? `${props.data.isActive ? ' Deactivating...' : 'Activating...'}`
          : `${ props.data.isActive ? 'Deactivate' : 'Activate'}` }}
      </Button>
    </template>
  </Dialog>
</template>

<style scoped></style>