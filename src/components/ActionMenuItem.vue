<script setup>
import { computed } from 'vue'

const props = defineProps(['severity', 'label', 'disabled', 'as'])

const classes = computed(() => {
  return {
    'action-menu__item--danger': props.severity === 'danger',
    'action-menu__item--success': props.severity === 'success',
    'action-menu__item--disabled': props.disabled
  }
})

const Component = props.as || 'div'
</script>

<template>
  <component :is="Component" class="action-menu__item" :class="classes">
    <slot>{{ props.label }}</slot>
  </component>
</template>

<style scoped>
.action-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  color: #2b2b2b;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  line-height: 16px;
  border-radius: 6px;

  &:hover {
    background-color: #f4f4f4;
  }

  &.action-menu__item--danger {
    color: #ff4d4f;
  }
  &.action-menu__item--success {
    color: rgb(46, 155, 70);
  }
}

.action-menu__item--disabled {
  opacity: 0.5;
  cursor: no-drop;
}
</style>
