import api from '@/stores/axios.js'

const domain = import.meta.env.VITE_HMS_API_URL

/**
 * Get all appointments
 *
 * @returns {Promise<Array>} - List of appointments
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAllAppointments = async () => {
    try {
        return await api.get(`${domain}/Booking/GetAllBookings`)
    } catch (error) {
        throw new Error(`Error getting appointments: ${error}`)
    }
}