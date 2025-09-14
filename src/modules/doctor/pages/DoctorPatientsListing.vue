<script setup>
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import {computed} from "vue";
import {Search} from "@iconoir/vue";
import { useHospitalStore } from "@/stores/hospital.js";
import {useUser} from "@/modules/auth/sdk/user.js";
import {getPatientsForDoctor} from "@/modules/doctor/sdk/api.js";

const {user} = useUser();
const hospitalStore = useHospitalStore();

const queryKey = ['doctor-patients', user.value?.id];

const { data: patients, isLoading: IsPatientsLoading, isError: isPatientsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getPatientsForDoctor(Number(user.value?.doctorId)),
});

const filteredPatients = computed(() => {
  if (!patients?.value) return []
  const term = hospitalStore.patientSearchTerm.toLowerCase()
  return patients.value.filter(p =>
      p.user.firstName?.toLowerCase().includes(term) ||
      p.user.lastName?.toLowerCase().includes(term) ||
      p.user.email?.toLowerCase().includes(term)
  )
})
</script>

<template>
  <div class="d-flex justify-content-between mb-3">
    <div>
      <InputGroup>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputText
            v-model="hospitalStore.patientSearchTerm"
            type="text"
            class="patient-search-input"
            placeholder="Search by name or email"
        />
      </InputGroup>
    </div>
  </div>
  <DataTable
      :value="filteredPatients"
      :paginator="true"
      :rows="hospitalStore.itemsPerPage"
      :totalRecords="filteredPatients.length"
      :first="hospitalStore.currentPage"
      @page="hospitalStore.onPage"
  >
    <Column header="No.">
      <template #body="{ index }">
        <span>{{ filteredPatients.length - (hospitalStore.currentPage + index) }}.</span>
      </template>>
    </Column>
    <Column header="First name" field="user.firstName" />
    <Column header="Last name" field="user.lastName" />
    <Column header="Email" field="user.email" />
    <Column header="Appointments" field="totalBookings" />
    <Column header="Money Spent" field="">
      <template #body="{ data }">
        <span>{{ data.totalSpent.toFixed(2) }} &euro;</span>
      </template>
    </Column>
    <template #empty>
      <TableSkeleton rows="10" columns="7" v-if="IsPatientsLoading" />
      <p v-if="isPatientsError">Something went wrong, please try again.</p>
      <template v-if="!IsPatientsLoading && !isPatientsError">
        <p class="text-center m-0">
          No patients found.
        </p>
      </template>
    </template>
  </DataTable>
</template>

<style scoped>
</style>