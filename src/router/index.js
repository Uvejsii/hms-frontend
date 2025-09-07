import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/modules/auth/sdk/user.js'

const { isUserLoggedIn, userRole } = useUser()

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
    {
      path: '/admin',
      name: 'admin',
      meta: { requiresAdmin: true },
      children: [
        {
          path: 'admin-dashboard',
          name: 'admin-dashboard',
          component: () => import('@/modules/admin/pages/AdminDashboard.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'doctors-management',
          name: 'doctors-management',
          component: () => import('@/modules/admin/pages/doctors/DoctorsListing.vue'),
          redirect: { name: 'doctors-active' },
          meta: { requiresAdmin: true },
          children: [
            {
              path: "active",
              name: "doctors-active",
              component: () => import('@/modules/admin/pages/doctors/DoctorsActive.vue'),
              meta: { requiresAdmin: true },
            },
            {
              path: "inactive",
              name: "doctors-inactive",
              component: () => import('@/modules/admin/pages/doctors/DoctorsInactive.vue'),
              meta: { requiresAdmin: true },
            },
          ]
        },
        {
          path: 'departments-management',
          name: 'departments-management',
          component: () => import('@/modules/admin/pages/departments/DepartmentsListing.vue'),
          redirect: { name: 'departments-active' },
          meta: { requiresAdmin: true },
          children: [
            {
              path: "active",
              name: "departments-active",
              component: () => import('@/modules/admin/pages/departments/DepartmentsActive.vue'),
              meta: { requiresAdmin: true },
            },
            {
              path: "inactive",
              name: "departments-inactive",
              component: () => import('@/modules/admin/pages/departments/DepartmentsInActive.vue'),
              meta: { requiresAdmin: true },
            },
          ],
        },
        {
          path: 'patients',
          name: 'patients',
          component: () => import('@/modules/admin/pages/patients/PatientsListing.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'appointments',
          name: 'appointments',
          component: () => import('@/modules/admin/pages/appointments/pages/AppointmentsListing.vue'),
          meta: { requiresAdmin: true },
        },
        {
          path: 'vacations',
          name: 'vacations',
          component: () => import('@/modules/admin/pages/vacations/VacationsCalendar.vue'),
          meta: { requiresAdmin: true },
        },
      ]
    },
    {
      path: '/doctor',
      name: 'doctor',
      meta: { requiresDoctor: true },
      children: [
        {
          path: 'doctor-dashboard',
          name: 'doctor-dashboard',
          component: () => import('@/modules/doctor/pages/DoctorDashboard.vue'),
          meta: { requiresDoctor: true },
        },
        {
          path: 'doctor-appointments',
          name: 'doctor-appointments',
          component: () => import('@/modules/doctor/pages/DoctorAppointmentsCalendar.vue'),
          meta: { requiresDoctor: true },
        }
      ]
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (!isUserLoggedIn && to.name !== 'login' && to.name !== 'register') {
    next({ name: 'login' })
  } else if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (isUserLoggedIn && userRole.value === 'Admin') {
      next()
    } else {
      next({ name: 'home' })
    }
  } else {
    next()
  }
})

export default router
