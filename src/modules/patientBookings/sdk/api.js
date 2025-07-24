import api from '@/stores/axios.js'

const domain = import.meta.env.VITE_HMS_API_URL

/**
 * Get all bookings by user ID
 *
 * @param {String} userId
 *
 * @returns {Promise<Array>} - Array of bookings
 *
 * @throws {Error} - When the response status is not 200
 */

export const getBookingsByUserId = async (userId) => {
    try {
        return await api.get(`${domain}/Booking/GetBookingsByUserId`, {
            params: { userId },
        })
    } catch (error) {
        throw new Error(`Error getting doctors: ${error}`)
    }
}