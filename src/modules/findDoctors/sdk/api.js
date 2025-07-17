import api from '@/stores/axios.js'

const domain = import.meta.env.VITE_HMS_API_URL

/**
 * Get all doctors
 *
 * @returns {Promise<Array>} - Array of doctors
 *
 * @throws {Error} - When the response status is not 200
 */

export const getDoctors = async () => {
    try {
        return await api.get(`${domain}/Doctors/GetAllDoctors`)
    } catch (error) {
        throw new Error(`Error getting doctors: ${error}`)
    }
}

/**
 * Get doctor reviews by doctor ID
 *
 * @param {Number} doctorId
 *
 * @returns {Promise<Array>} - Array of reviews for the specified doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getDoctorReviewsByDrId = async (doctorId) => {
    try {
        return await api.get(`${domain}/DoctorReview/GetDoctorReviewsByDrId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting reviews for doctor: ${error}`)
    }
}

/**
 * Add a doctor review
 *
 * @param {Object} data
 * @param {Number} data.doctorId
 * @param {String} data.reviewerId
 * @param {Number} data.stars
 * @param {String} data.comment
 *
 * @returns {Promise<Object>} - the created review object
 *
 * @throws {Error} - When the response status is not 200
 */

export const addDoctorReview = async (data) => {
    try {
        return await api.post(`${domain}/DoctorReview/CreateDoctorReview`, {
            doctorId: data.doctorId,
            reviewerId: data.reviewerId,
            stars: data.stars,
            comment: data.comment
        })
    } catch (error) {
        throw new Error(`Error adding review for doctor: ${error}`)
    }
}

/**
 * Delete a doctor review
 *
 * @param {Object} data
 * @param {String} data.reviewId
 * @param {Number} data.doctorId
 *
 * @returns {Promise<Object>} - the deleted review object
 *
 * @throws {Error} - When the response status is not 200
 */

export const deleteDoctorReview = async (data) => {
    try {
        return await api.delete(`${domain}/DoctorReview/DeleteDoctorReview`, {
            params: {
                reviewId: data.reviewId,
                doctorId: data.doctorId,
            }
        })
    } catch (error) {
        throw new Error(`Error deleting review for doctor: ${error}`)
    }
}

/**
 * Update a doctor review
 *
 * @param {Object} data
 * @param {Number} data.id
 * @param {Number} data.stars
 * @param {String} data.comment
 * @param {Number} data.doctorId
 *
 * @returns {Promise<Object>} - the updated review object
 *
 * @throws {Error} - When the response status is not 200
 */

export const editDoctorReview = async (data) => {
    try {
        return await api.put(`${domain}/DoctorReview/UpdateDoctorReview`, {
            stars: data.stars,
            comment: data.comment,
            doctorId: data.doctorId
        }, {
            params: {
                id: data.id,
            }
        })
    } catch (error) {
        throw new Error(`Error editing review for doctor: ${error}`)
    }
}

/**
 * Get available appointments for doctor by ID
 *
 * @param {Number} doctorId
 * @param {Number} day
 *
 * @returns {Promise<Array>} - Array of free appointments for the specified doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAvailableAppointments = async (doctorId, day) => {
    try {
        return await api.get(`${domain}/Booking/GetFreeBookingSlotsByDay`, {
            params: {
                doctorId,
                day
            }
        })
    } catch (error) {
        throw new Error(`Error getting appointments for doctor: ${error}`)
    }
}

/**
 * Book an appointment with a doctor
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>} - the created appointment object
 *
 * @throws {Error} - When the response status is not 200
 */

export const bookAppointment = async (data) => {
    try {
        return await api.post(`${domain}/Booking/CreateBooking`, {
            ...data
        })
    } catch (error) {
        throw new Error(`Error booking appointment with doctor: ${error}`)
    }
}