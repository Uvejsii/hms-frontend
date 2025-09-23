import api from '@/stores/axios.js'

const domain = import.meta.env.VITE_HMS_API_URL

/**
 * Get patients of a doctor by doctorId
 *
 * @param {String} doctorId - ID of the doctor
 *
 * @returns {Promise<Array>} - Patients of the doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getPatientsForDoctor = async (doctorId) => {
    try {
        return await api.get(`${domain}/Booking/GetPatientsByDoctorId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting patients for the doctor: ${error}`)
    }
}

/**
 * Get total vacation requests of a doctor by doctorId
 *
 * @param {String} doctorId - ID of the doctor
 *
 * @returns {Promise<Array>} - Total vacation requests of the doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalVacationRequestsByDrId = async (doctorId) => {
    try {
        return await api.get(`${domain}/DoctorVacation/GetTotalVacationRequestsByDrId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting total vacation requests for the doctor: ${error}`)
    }
}

/**
 * Request vacation for a doctor
 *
 * @param {Object} data - Vacation request data
 *
 * @param {String} data.doctorId - ID of the doctor
 *
 * @param {String} data.startDate - Start date of the vacation
 *
 * @param {String} data.endDate - End date of the vacation
 *
 * @param {Number} data.vacationType - Type of the vacation (0: Vacation, 1: Sick Leave, 2: Unpaid Leave)
 *
 * @returns {Promise<Object>} - Response from the backend
 *
 * @throws {Error} - When the response status is not 200
 */

export const requestVacation = async (data) => {
    try {
        return await api.post(`${domain}/DoctorVacation/RequestVacation`, {
            doctorId: data.doctorId,
            startDate: data.startDate,
            endDate: data.endDate,
            vacationType: data.vacationType,
        })
    } catch (error) {
        throw new Error(`Error requesting vacation for the doctor: ${error}`)
    }
}

/**
 * Get total vacation requests of a doctor by doctorId
 *
 * @param {String} doctorId - ID of the doctor
 *
 * @param {String} startDate - Start date of the vacation
 *
 * @param {String} endDate - End date of the vacation
 *
 * @returns {Promise<Boolean>} - Returns true if vacation exists, false otherwise
 *
 * @throws {Error} - When the response status is not 200
 */

export const checkIfVacationExists = async (doctorId, startDate, endDate) => {
    try {
        return await api.get(`${domain}/DoctorVacation/CheckIfVacationExists`, {
            params: { doctorId, startDate, endDate }
        })
    } catch (error) {
        throw new Error(`Error checking if vacation exits: ${error}`)
    }
}

/**
 * Get doctor reviews by doctorId
 *
 * @param {String} doctorId - ID of the doctor
 *
 * @returns {Promise<Array>} - Returns reviews of the doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAllDoctorReviews = async (doctorId) => {
    try {
        return await api.get(`${domain}/DoctorReview/GetDoctorReviewsByDrId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting doctor reviews: ${error}`)
    }
}

/**
 * Get today's appointments by doctorId
 *
 * @param {String} doctorId - ID of the doctor
 *
 * @returns {Promise<Array>} - Returns today's appointments of the doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAppointmentsForToday = async (doctorId) => {
    try {
        return await api.get(`${domain}/Booking/GetTodayBookingsByDoctorId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting appointments for today: ${error}`)
    }
}

/**
 * Get total patients and earnings by doctorId
 *
 * @param {String} doctorId - ID of the doctor
 *
 * @returns {Promise<Array>} - Returns total patients and earnings of the doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalPatientsAndEarnings = async (doctorId) => {
    try {
        return await api.get(`${domain}/Booking/GetTotalPatientsAndEarningsByDoctorId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting patients and earnings for today: ${error}`)
    }
}

/**
 * Get all application users who are doctors
 *
 * @returns {Promise<Array>} - Returns application users who are doctors
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAllAppUserDoctors = async () => {
    try {
        return await api.get(`${domain}/Auth/GetAllActiveAppUserDoctors`)
    } catch (error) {
        throw new Error(`Error getting application users who are doctors: ${error}`)
    }
}

/**
 * Get chat messages
 *
 * @param {String} receiverId - ID of the receiver
 * @param {String} senderId - ID of the sender
 *
 * @returns {Promise<Array>} - Returns chat messages between the receiver and sender
 *
 * @throws {Error} - When the response status is not 200
 */

export const getChatMessages = async (senderId, receiverId) => {
    try {
        return await api.get(`${domain}/Chat/GetMessages`, {
            params: { senderId, receiverId }
        })
    } catch (error) {
        throw new Error(`Error getting chat messages: ${error}`)
    }
}

/**
 * Send chat message
 *
 * @param {String} senderId - ID of the sender
 * @param {String} receiverId - ID of the receiver
 * @param {String} message - message content
 *
 * @returns {Promise<Object>} - Returns the endpoint response
 *
 * @throws {Error} - When the response status is not 200
 */

export const sendChatMessage = async (senderId, receiverId, message) => {
    try {
        return await api.post(`${domain}/Chat/SendMessage`, {
            senderId,
            receiverId,
            message
        })
    } catch (error) {
        throw new Error(`Error sending chat message: ${error}`)
    }
}