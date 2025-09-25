<script setup>
import { ref } from 'vue'
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { Journal, Archive } from "@iconoir/vue";
import {generateInvoice, generatePrescription} from "@/utils/helpers.js";

const visible = ref(true)
const emit = defineEmits(['close'])
const props = defineProps(['data'])

const cancel = () => {
  emit('close', null)
}
</script>

<template>
  <Dialog
      style="width: 468px"
      @hide="cancel"
      :header="`Appointment with Dr. ${data.doctor.firstName} ${data.doctor.lastName}`"
      :draggable="false"
      v-model:visible="visible"
      modal
  >
    <div class="download-container d-flex justify-content-between">
      <Button
          severity="success"
          variant="outlined"
          class="d-flex flex-column"
          @click="generatePrescription(data)">
        <Journal height="40" width="40" />
        Download Prescription
      </Button>
      <Button
          severity="success"
          variant="outlined"
          class="d-flex flex-column"
          @click="generateInvoice(data)">
        <Archive height="40" width="40" />
        Download Invoice
      </Button>
    </div>
    <template #footer>
      <Button @click="cancel" severity="secondary" outlined>Cancel</Button>
    </template>
  </Dialog>
</template>

<style scoped>
</style>