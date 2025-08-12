<script setup>
const props = defineProps({
  rows: {
    default: 3
  },
  columns: {
    default: 1
  }
})
</script>

<template>
  <div v-for="item in Number(rows)" class="table-skeleton__row">
    <Skeleton v-for="column in Number(columns)" />
  </div>
</template>

<style scoped>
.table-skeleton__row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
