<script setup>
import { ref } from 'vue'
import Button from "primevue/button";
import Popover from "primevue/popover";
import { MoreVert } from "@iconoir/vue";

const op = ref()
const toggle = (event) => {
  op.value.toggle(event)
}
</script>

<template>
  <div class="action-menu">
    <div class="action-menu__trigger" @click.stop="toggle">
      <slot name="trigger">
        <Button outlined class="p-button-icon-only">
          <MoreVert />
        </Button>
      </slot>
    </div>
    <Popover :unstyled="true" ref="op">
      <div class="action-menu__content" @click="toggle">
        <slot></slot>
      </div>
    </Popover>
  </div>
</template>

<style scoped>
.action-menu__content {
  box-shadow: 0px 3px 8px 0px #0000001f;
  background-color: white;
  border-radius: 4px;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  margin-left: -10px;
}
</style>
