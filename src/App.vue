<script setup>
import { RouterView } from 'vue-router'
import {Toast} from "primevue";
import Popups from "@/components/popups/Popups.vue";
import {VueQueryDevtools} from "@tanstack/vue-query-devtools";
import { IconoirProvider } from '@iconoir/vue'
import Header from "@/components/Header.vue";
</script>

<template>
  <IconoirProvider :icon-props="{ width: 20 }">
    <Popups>
        <VueQueryDevtools />
        <Toast/>
        <Header />
        <div class="container-fluid my-3">
          <RouterView />
        </div>
    </Popups>
  </IconoirProvider>
</template>

<style scoped>
</style>
