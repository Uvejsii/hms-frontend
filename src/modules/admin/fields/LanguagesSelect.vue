<script setup>
import { ref, watch } from "vue";

const { modelValue } = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});
const emit = defineEmits(['update:modelValue']);

const selectedLanguages = ref(modelValue);

const languages = ref([
  'Albanian', 'English', 'Spanish', 'Mandarin', 'Arabic', 'Hindi', 'French',
  'Russian', 'German', 'Portuguese', 'Japanese', 'Italian', 'Korean', 'Dutch',
  'Turkish', 'Swedish', 'Polish', 'Greek', 'Hebrew', 'Bengali', 'Urdu', 'Macedonian',
  'Romanian', 'Bulgarian', 'Croatian', 'Ukrainian'
]);

watch(selectedLanguages, (newLanguages) => {
  emit('update:modelValue', newLanguages);
});
</script>

<template>
  <div>
    <MultiSelect
        v-model="selectedLanguages"
        display="chip"
        :options="languages"
        filter
        placeholder="Select a language"
        :maxSelectedLabels="2"
    />
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
