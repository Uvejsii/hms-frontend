<script setup>
import {useQuery} from "@tanstack/vue-query";
import {getDepartments} from "@/modules/admin/sdk/api.js";

const { data, isLoading } = useQuery({
  queryKey: ['departments'],
  queryFn: () => getDepartments(true)
})
</script>

<template>
  <Select
      :options="data"
      optionValue="id"
      optionLabel="name"
      :loading="isLoading"
      placeholder="Select a department"
  />
</template>

<style scoped>

</style>