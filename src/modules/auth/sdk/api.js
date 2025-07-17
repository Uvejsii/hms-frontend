import api from '@/stores/axios.js'

const domain = import.meta.env.VITE_HMS_API_URL

/**
 * Login to platform
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>} - The user object
 *
 * @throws {Error} - When the response status is not 200
 */

export const login = async (data) => {
    try {
        return await api.post(`${domain}/Auth/Login`, data)
    } catch (error) {
        throw new Error(`Error logging in: ${error}`)
    }
}

/**
 * Register patient to platform
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>} - The registered patient object
 *
 * @throws {Error} - When the response status is not 200
 */

export const registerPatient = async (data) => {
    try {
        return await api.post(`${domain}/Auth/RegisterPatient`, data)
    } catch (error) {
        throw new Error(`Error logging in: ${error}`)
    }
}