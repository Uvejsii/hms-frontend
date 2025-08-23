<script setup>
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import { Trash } from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import {computed, inject} from "vue";
import {getDepartments} from "@/modules/admin/sdk/api.js";
import { useHospitalStore } from "@/stores/hospital.js";

const hospitalStore = useHospitalStore();

const queryKey = ['departments-inactive'];

const { data: departments, isLoading: IsDepartmentsLoading, isError: isDepartmentsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getDepartments(false),
});

const filteredDepartments = computed(() => {
  if (!departments?.value) return []
  const term = hospitalStore.departmentSearchTerm.toLowerCase()
  return departments.value.filter(d =>
      d.name?.toLowerCase().includes(term) ||
      d.location?.toLowerCase().includes(term)
  )
})

const showUpdateDepartmentStatusPopup = inject('showUpdateDepartmentStatusPopup')
const openUpdateDepartmentStatusPopup = (data) => {
  showUpdateDepartmentStatusPopup({...data, revalidateKey: queryKey});
}
</script>

<template>
  <DataTable
      :value="filteredDepartments"
      responsiveLayout="scroll"
      :paginator="true"
      :rows="hospitalStore.itemsPerPage"
      :totalRecords="filteredDepartments.length"
      :first="hospitalStore.currentPage"
      @page="hospitalStore.onPage"
  >
    <Column header="No.">
      <template #body="{ index }">
        <span>{{ filteredDepartments.length - (hospitalStore.currentPage + index) }}.</span>
      </template>>
    </Column>
    <Column header="Name" field="name" />
    <Column header="Location" field="location" />
    <Column header="Actions">
      <template #body="{ data }">
        <ActionMenu>
          <ActionMenuItem severity="success" @click="openUpdateDepartmentStatusPopup(data)">
            <Trash /> Activate
          </ActionMenuItem>
        </ActionMenu>
      </template>
    </Column>
    <template #empty>
      <TableSkeleton rows="10" columns="7" v-if="IsDepartmentsLoading" />
      <p v-if="isDepartmentsError">Something went wrong, please try again.</p>
      <template v-if="!IsDepartmentsLoading && !isDepartmentsError">
        <p class="text-center m-0">
          No inactive departments found.
        </p>
      </template>
    </template>
  </DataTable>
</template>

<style scoped>
</style>