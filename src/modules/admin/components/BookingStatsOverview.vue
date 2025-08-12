<script setup>
import TableSkeleton from "@/components/TableSkeleton.vue";

defineProps({
  data: Object,
  appointmentsLoading: Boolean,
});
</script>

<template>
  <div class="admin-dashboard-chart">
    <div class="admin-dashboard-chart-title">
      <p>Booking Status Overview</p>
    </div>
    <div class="p-3" v-if="appointmentsLoading">
      <TableSkeleton rows="10" columns="2" />
    </div>
    <div class="p-3 d-flex flex-column gap-2" v-else>
      <div class="test">
        <Tag severity="warn" :value="`Pending ${data.pendingTotal}`" />
        <Tag severity="secondary" :value="`Confirmed ${data.confirmedTotal}`" />
      </div>
      <div class="test">
        <Tag severity="info" :value="`Ongoing ${data.ongoingTotal}`" />
        <Tag severity="success" :value="`Finished ${data.finishedTotal}`" />
      </div>
      <div class="d-flex test">
        <Tag severity="danger" :value="`Cancelled ${data.cancelledTotal}`" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.test {
  display: flex;
  gap: 15px;
  width: 100%;
  height: 70px;
}

.p-tag {
  width: 100%;
  font-size: 20px;
  border: 1px solid rgba(202, 229, 216, 0.63);
}
</style>