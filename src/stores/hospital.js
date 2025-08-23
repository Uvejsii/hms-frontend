import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useHospitalStore = defineStore('hospital', () => {
  const doctorSearchTerm = ref('')
  const departmentSearchTerm = ref('')
  const patientSearchTerm = ref('')

  const currentPage = ref(0)
  const itemsPerPage = ref(7)

  const onPage = (event) => {
    currentPage.value = event.first
  }

  return {
    doctorSearchTerm,
    departmentSearchTerm,
    patientSearchTerm,
    currentPage,
    itemsPerPage,
    onPage
  }
})
