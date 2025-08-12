import api from '@/stores/axios.js'

const domain = import.meta.env.VITE_HMS_API_URL

/**
 * Get total doctors count
 *
 * @returns {Promise<Number>} - Total count of doctors
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalDoctors = async () => {
    try {
        return await api.get(`${domain}/Doctors/GetTotalDoctors`)
    } catch (error) {
        throw new Error(`Error getting total doctors count: ${error}`)
    }
}

/**
 * Get total available doctors count
 *
 * @returns {Promise<Number>} - Total available count of doctors
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalAvailableDoctors = async () => {
    try {
        return await api.get(`${domain}/Doctors/GetTotalAvailableDoctors`)
    } catch (error) {
        throw new Error(`Error getting available total doctors count: ${error}`)
    }
}

/**
 * Get total available doctors count
 *
 * @returns {Promise<Number>} - Total count of available doctors
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalUnavailableDoctors = async () => {
    try {
        return await api.get(`${domain}/Doctors/GetTotalUnavailableDoctors`)
    } catch (error) {
        throw new Error(`Error getting unavailable total doctors count: ${error}`)
    }
}

/**
 * Get total departments count
 *
 * @returns {Promise<Number>} - Total count of departments
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalDepartments = async () => {
    try {
        return await api.get(`${domain}/Department/GetTotalDepartments`)
    } catch (error) {
        throw new Error(`Error getting total departments count: ${error}`)
    }
}

/**
 * Get total patients count
 *
 * @returns {Promise<Number>} - Total count of patients
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalPatients = async () => {
    try {
        return await api.get(`${domain}/Auth/GetTotalPatients`)
    } catch (error) {
        throw new Error(`Error getting total patients count: ${error}`)
    }
}

/**
 * Get total appointment count
 *
 * @returns {Promise<Number>} - Total count of appointment
 *
 * @throws {Error} - When the response status is not 200
 */

export const getTotalAppointments = async () => {
    try {
        return await api.get(`${domain}/Booking/GetTotalBookings`)
    } catch (error) {
        throw new Error(`Error getting total appointments count: ${error}`)
    }
}

/**
 * Get doctor count per department
 *
 * @returns {Promise<Array>} - List doctor count per department
 *
 * @throws {Error} - When the response status is not 200
 */

export const getDoctorCountPerDepartment = async () => {
    try {
        return await api.get(`${domain}/Department/GetDoctorCountPerDepartment`)
    } catch (error) {
        throw new Error(`Error getting doctor count per departments: ${error}`)
    }
}

/**
 * Get monthly appointment totals
 *
 * @returns {Promise<Array>} - List monthly appointment totals
 *
 * @throws {Error} - When the response status is not 200
 */

export const getMonthlyAppointmentTotals = async () => {
    try {
        return await api.get(`${domain}/Booking/GetMonthlyBookingTotals`)
    } catch (error) {
        throw new Error(`Error getting monthly appointment totals: ${error}`)
    }
}

/**
 * Add doctor
 *
 * @returns {Promise<Object>} - Response object containing the added doctor's details
 *
 * @throws {Error} - When the response status is not 200
 */

export const addDoctor = async (doctorData) => {
    try {
        return await api.post(`${domain}/Auth/RegisterDrFull`, doctorData)
    } catch (error) {
        throw new Error(`Error adding doctor: ${error}`)
    }
}

/**
 * Edit doctor by id
 *
 * @param {Object} doctorData - Data of the doctor to be edited
 *
 * @returns {Promise<Object>} - Response object containing the added doctor's details
 *
 * @throws {Error} - When the response status is not 200
 */

export const editDoctor = async (doctorData) => {
    try {
        return await api.put(`${domain}/Doctors/EditDoctor`, doctorData,{
            params: { id: doctorData.id }
        })
    } catch (error) {
        throw new Error(`Error updating doctor: ${error}`)
    }
}

/**
 * Delete doctor by id
 *
 * @param {String} id - id of the doctor to be deleted
 *
 * @returns {Promise<Object>} - Response object containing the added doctor's details
 *
 * @throws {Error} - When the response status is not 200
 */

export const deleteDoctor = async (id) => {
    try {
        return await api.delete(`${domain}/Doctors/DeleteDoctor`,{
            params: { id }
        })
    } catch (error) {
        throw new Error(`Error deleting doctor: ${error}`)
    }
}

/**
 * Get departments
 *
 * @returns {Promise<Array>} - List departments
 *
 * @throws {Error} - When the response status is not 200
 */

export const getDepartments = async () => {
    try {
        return await api.get(`${domain}/Department/GetAllDepartments`)
    } catch (error) {
        throw new Error(`Error getting departments: ${error}`)
    }
}