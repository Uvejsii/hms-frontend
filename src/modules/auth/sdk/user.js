import { ref } from 'vue'

const user = ref(JSON.parse(localStorage.getItem('hmsUser')))

const logout = async (router) => {
    try {
        localStorage.removeItem('hmsUser')
        user.value = null
        router.push({ name: 'login' })
    } catch (error) {
        console.error(error)
    }
}

const isUserLoggedIn = () => !!user.value?.token

export const useUser = () => {
    return { user, logout, isUserLoggedIn }
}
