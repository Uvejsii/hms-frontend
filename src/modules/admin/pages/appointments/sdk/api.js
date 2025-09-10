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

/**
 * Edit appointment status
 *
 * @param {Object} data - Data to update appointment status
 * @param {Number} data.bookingId - ID of the appointment
 * @param {Number} data.bookingStatus - New status of the appointment
 * @param {String} data.bookingPrescription - Prescription of the appointment
 *
 * @returns {Promise<Object>} - Updated appointment
 *
 * @throws {Error} - When the response status is not 200
 */

export const editAppointmentStatus = async (data) => {
    try {
        return await api.put(`${domain}/Booking/UpdateBookingStatus`, {
            id: data.bookingId,
            status: data.bookingStatus,
            prescription: data.bookingPrescription || ''
        })
    } catch (error) {
        throw new Error(`Error updating appointments status: ${error}`)
    }
}