<script setup>
import { MediaImageXmark } from "@iconoir/vue";

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  altText: {
    type: String,
    default: 'Image Preview'
  }
});
</script>

<template>
  <div class="image-preview">
    <Image v-if="imageUrl" :src="imageUrl" :alt="altText" preview imageClass="doctor-image" />
    <MediaImageXmark v-else />
  </div>
</template>

<style scoped>
::v-deep(.doctor-image) {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>