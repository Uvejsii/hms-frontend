import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/modules/auth/sdk/user.js'

const { isUserLoggedIn } = useUser()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/register",
      name: "register",
      component: () => import('@/modules/auth/pages/Register.vue'),
    },
    {
      path: "/login",
      name: "login",
      component: () => import('@/modules/auth/pages/Login.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/modules/findDoctors/pages/DoctorsListing.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/modules/profile/pages/ProfilePage.vue'),
    },
    {
      path: '/patient-appointments',
      name: 'patient-appointments',
      component: () => import('@/modules/patientBookings/pages/PatientBookingsListing.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!isUserLoggedIn && to.name !== 'login' && to.name !== 'register') {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
