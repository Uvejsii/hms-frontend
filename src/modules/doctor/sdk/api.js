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