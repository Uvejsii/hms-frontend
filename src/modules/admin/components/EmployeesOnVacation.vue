<script setup>
import TableSkeleton from "@/components/TableSkeleton.vue";

const customers = [
  {
    name: 'John Doe',
    department: 'Hematology',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'Alice Johnson',
    department: 'Cardiology',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'Michael Brown',
    department: 'Orthopedics',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'John Doe',
    department: 'Hematology',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'Alice Johnson',
    department: 'Cardiology',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'Michael Brown',
    department: 'Orthopedics',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'John Doe',
    department: 'Hematology',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'Alice Johnson',
    department: 'Cardiology',
    date: '01/08/2025 - 30/08/2025',
  },
  {
    name: 'Michael Brown',
    department: 'Orthopedics',
    date: '01/08/2025 - 30/08/2025',
  },
];
</script>

<template>
  <div class="admin-dashboard-chart-large">
    <div class="admin-dashboard-chart-title">
      <p>Employees on vacation</p>
    </div>
    <div class="p-3">
      <TableSkeleton
          v-if="false"
          rows="10"
          columns="1"
      />
      <div>
        <DataTable :value="customers" paginator :rows="5">
          <Column field="name" header="Name" style="width: 25%"></Column>
          <Column field="department" header="Department" style="width: 25%"></Column>
          <Column field="date" header="Date" style="width: 25%"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>