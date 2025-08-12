<script setup>
defineProps({
  count: [Object, Number],
  label: String,
  icon: Object,
  bgClass: String
});
</script>

<template>
  <div :class="`admin-dashboard-stats-card ${bgClass} text-white`">
    <div class="left-stats-card">
      <p class="m-0">{{ count }}</p>
      <p class="m-0">{{ label }}</p>
    </div>
    <div class="right-stats-card">
      <component :is="icon" width="50" height="50" />
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard-stats-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1 1 calc(23.333% - 20px);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  font-weight: bold;
}

.left-stats-card p:first-of-type {
  font-size: 35px ;
}

.left-stats-card p:last-of-type {
  font-size: 20px ;
}
</style>