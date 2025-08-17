<script setup>
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import { EditPencil, Trash } from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import {inject} from "vue";
import {getDepartments} from "@/modules/admin/sdk/api.js";

const queryKey = ['departments-active'];

const { data: departments, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useQuery({
  queryKey: queryKey,
  queryFn: () => getDepartments(true),
});

const showEditDepartmentPopup = inject('showEditDepartmentPopup')
const openEditDepartmentPopup = (data) => {
  showEditDepartmentPopup({...data});
}

const showUpdateDepartmentStatusPopup = inject('showUpdateDepartmentStatusPopup')
const openUpdateDepartmentStatusPopup = (data) => {
  showUpdateDepartmentStatusPopup({...data, revalidateKey: queryKey });
}
</script>

<template>
  <DataTable :value="departments" responsiveLayout="scroll">
    <Column header="Name" field="name" />
    <Column header="Location" field="location" />
    <Column header="Actions">
      <template #body="{ data }">
        <ActionMenu>
          <ActionMenuItem @click="openEditDepartmentPopup(data)">
            <EditPencil/> Edit
          </ActionMenuItem>
          <ActionMenuItem severity="danger" @click="openUpdateDepartmentStatusPopup(data)">
            <Trash /> Deactivate
          </ActionMenuItem>
        </ActionMenu>
      </template>
    </Column>
    <template #empty>
      <TableSkeleton rows="10" columns="7" v-if="isDepartmentsLoading" />
      <p v-if="isDepartmentsError">Something went wrong, please try again.</p>
      <template v-if="!isDepartmentsLoading && !isDepartmentsError">
        <p class="text-center m-0">
          No active departments found.
        </p>
      </template>
    </template>
  </DataTable>
</template>

<style scoped>
</style>