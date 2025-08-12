<script setup>
import {getDoctors} from "@/modules/findDoctors/sdk/api.js";
import {useQuery} from "@tanstack/vue-query";
import TableSkeleton from "@/components/TableSkeleton.vue";
import { Check, Xmark, Plus, EditPencil, Trash } from "@iconoir/vue";
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from "@/components/ActionMenuItem.vue";
import {inject} from "vue";

const { data: doctors, isLoading: IsDoctorsLoading } = useQuery({
  queryKey: ['doctors'],
  queryFn: () => getDoctors(),
});

const showAddDoctorPopup = inject('showAddDoctorPopup')
const openAddDoctorPopup = () => {
  showAddDoctorPopup();
}

const showEditDoctorPopup = inject('showEditDoctorPopup')
const openEditDoctorPopup = (data) => {
  showEditDoctorPopup({...data});
}

const showDeleteDoctorPopup = inject('showDeleteDoctorPopup')
const openDeleteDoctorPopup = (data) => {
  showDeleteDoctorPopup({...data});
}
</script>

<template>
  <div class="text-end mb-2">
    <Button @click="openAddDoctorPopup">
      <Plus/> Add Doctor
    </Button>
  </div>
  <TableSkeleton rows="10" columns="7" v-if="IsDoctorsLoading" />
  <DataTable v-else :value="doctors" responsiveLayout="scroll">
    <Column header="Doctor">
      <template #body="{ data }">
        <div class="d-flex gap-4 align-items-center">
          <Image :src="`${data?.imageFilePath}`" imageClass="doctor-image" preview alt="Doctor Image" />
          <span>{{ data?.firstName }} {{ data?.lastName }}</span>
        </div>
      </template>
    </Column>
    <Column header="Email" field="email" />
    <Column header="Department">
      <template #body="{ data }">
        <span>{{ data?.departament?.name }}</span>
      </template>
    </Column>
    <Column header="Experience">
      <template #body="{ data }">
        <span>{{ data?.yearsOfExperience }} years</span>
      </template>
    </Column>
    <Column header="Consultation Fee">
      <template #body="{ data }">
        <span>{{ data?.consultationFee }} &euro;</span>
      </template>
    </Column>
    <Column header="Phone number" field="phoneNumber" />
    <Column header="Available">
      <template #body="{ data }">
        <Tag :severity="data?.isAvailable ? 'success' : 'danger'">
          <span v-if="data?.isAvailable" class="d-flex gap-2 align-items-center">
            <Check /> Yes
          </span>
          <span v-else class="d-flex gap-2 align-items-center">
            <Xmark class="mr-2" /> No
          </span>
        </Tag>
      </template>
    </Column>
    <Column header="Actions">
      <template #body="{ data }">
        <ActionMenu>
          <ActionMenuItem @click="openEditDoctorPopup(data)">
            <EditPencil/> Edit
          </ActionMenuItem>
          <ActionMenuItem severity="danger" @click="openDeleteDoctorPopup(data)">
            <Trash /> Delete
          </ActionMenuItem>
        </ActionMenu>
      </template>
    </Column>
  </DataTable>
</template>

<style scoped>
::v-deep(.doctor-image) {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
</style>