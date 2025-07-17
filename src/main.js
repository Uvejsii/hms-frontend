import './assets/main.scss'
import '@/assets/base.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { setupAxiosInterceptors } from "@/stores/token.js";
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice';
import ActionMenu from "@/components/ActionMenu.vue";
import ActionMenuItem from '@/components/ActionMenuItem.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.component('ActionMenu', ActionMenu)
app.component('ActionMenuItem', ActionMenuItem)
app.use(ToastService)
app.use(VueQueryPlugin)
setupAxiosInterceptors(router)
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
    }
})

app.mount('#app')
