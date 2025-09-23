import api from './axios.js'
import router from "@/router/index.js";

export const setupAxiosInterceptors = () => {
    api.interceptors.request.use(
        (config) => {
            try {
                const userStr = localStorage.getItem('hmsUser')
                if (userStr) {
                    const user = JSON.parse(userStr)
                    if (user?.token) {
                        config.headers.Authorization = `Bearer ${user.token}`
                    }
                }
                return config
            } catch (error) {
                console.error('Error setting auth header:', error)
                return config
            }
        },
        (error) => Promise.reject(error)
    )

    api.interceptors.response.use(
        (response) => response.data,
        async (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('hmsUser')

                if (router) {
                    await router.push({ name: 'login' })
                } else {
                    window.location.href = '/login'
                }
            }

            return Promise.reject(error)
        }
    )
}
