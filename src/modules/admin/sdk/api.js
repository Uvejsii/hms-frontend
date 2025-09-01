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
 * Updates doctor status by id
 *
 * @param {String} id - id of the doctor to update status
 * @param {String} status - status of the doctor to update status
 *
 * @returns {Promise<Object>} - Response object
 *
 * @throws {Error} - When the response status is not 200
 */

export const updateDoctorStatus = async (id, status) => {
    try {
        return await api.put(`${domain}/Doctors/UpdateDoctorStatus`,null, {
            params: { id, status }
        })
    } catch (error) {
        throw new Error(`Error deactivating doctor: ${error}`)
    }
}

/**
 * Get departments
 * @param {String} status - status of the doctor to deactivate
 *
 * @returns {Promise<Array>} - List departments
 *
 * @throws {Error} - When the response status is not 200
 */

export const getDepartments = async (status) => {
    try {
        return await api.get(`${domain}/Department/GetAllDepartments`, {
            params: { status }
        })
    } catch (error) {
        throw new Error(`Error getting departments: ${error}`)
    }
}

/**
 * Add department
 *
 * @returns {Promise<Object>} - Response object containing the added department's details
 *
 * @throws {Error} - When the response status is not 200
 */

export const addDepartment = async (departmentData) => {
    try {
        return await api.post(`${domain}/Department/CreateDepartment`, departmentData)
    } catch (error) {
        throw new Error(`Error adding department: ${error}`)
    }
}

/**
 * Edit department
 *
 * @returns {Promise<Object>} - Response object containing the updated department's details
 *
 * @throws {Error} - When the response status is not 200
 */

export const editDepartment = async (departmentData) => {
    try {
        return await api.put(`${domain}/Department/EditDepartment`, departmentData, {
            params: { id: departmentData.id }
            },
        )
    } catch (error) {
        throw new Error(`Error editing department: ${error}`)
    }
}

/**
 * Update department status
 * @param {String} id - id of the department to update status
 * @param {String} status - status for the department to update
 *
 * @returns {Promise<Object>} - Response object
 *
 * @throws {Error} - When the response status is not 200
 */

export const editDepartmentStatus = async (id, status) => {
    try {
        return await api.put(`${domain}/Department/UpdateDepartmentStatus`, null, {
                params: { id, status }
            },
        )
    } catch (error) {
        throw new Error(`Error updating department status: ${error}`)
    }
}

/**
 * Get all patients
 *
 * @returns {Promise<Array>} - Array of patients
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAllPatients = async () => {
    try {
        return await api.get(`${domain}/Auth/GetAllPatients`)
    } catch (error) {
        throw new Error(`Error getting patients: ${error}`)
    }
}

/**
 * Get appointments for a patient
 *
 * @param {Number} userId
 *
 * @returns {Promise<Array>} - Array of appointments for the patient
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAppointmentsForPatient = async (userId) => {
    try {
        return await api.get(`${domain}/Booking/GetBookingsByUserId`, {
            params: { userId }
        })
    } catch (error) {
        throw new Error(`Error getting patients appointments: ${error}`)
    }
}

/**
 * Reset password by email
 *
 * @returns {Promise<Object>} - Response object
 *
 * @throws {Error} - When the response status is not 200
 */

export const resetPasswordByEmail = async (email) => {
    try {
        return await api.post(`${domain}/Auth/ResetPasswordCustom`, email)
    } catch (error) {
        throw new Error(`Error resetting password: ${error}`)
    }
}

/**
 * Get appointments for a doctor by doctor id
 *
 * @param {Number} doctorId
 *
 * @returns {Promise<Array>} - Array of appointments for the doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAppointmentsForDoctor = async (doctorId) => {
    try {
        return await api.get(`${domain}/Booking/GetBookingsByDoctorId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting doctors appointments: ${error}`)
    }
}

/** Get all vacations
 *
 * @param {Boolean} status - status of the vacations to fetch
 *
 * @returns {Promise<Array>} - Array of vacations
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAllVacations = async (status) => {
    try {
        return await api.get(`${domain}/DoctorVacation/GetAllVacations`, {
            params: { status }
        })
    } catch (error) {
        throw new Error(`Error getting vacations: ${error}`)
    }
}

/**
 * Get vacation requests for a doctor by doctor id
 *
 * @param {Number} doctorId
 *
 * @returns {Promise<Array>} - Array of vacation requests for the doctor
 *
 * @throws {Error} - When the response status is not 200
 */

export const getVacationRequestsForDoctor = async (doctorId) => {
    try {
        return await api.get(`${domain}/DoctorVacation/GetDoctorVacationsByDrId`, {
            params: { doctorId }
        })
    } catch (error) {
        throw new Error(`Error getting doctors vacation requests: ${error}`)
    }
}

/**
 * Get approved vacation requests
 *
 * @returns {Promise<Array>} - Array of approved vacation requests
 *
 * @throws {Error} - When the response status is not 200
 */

export const getAllApprovedVacationRequests = async () => {
    try {
        return await api.get(`${domain}/DoctorVacation/GetAllApprovedVacationRequests`)
    } catch (error) {
        throw new Error(`Error getting approved vacation requests: ${error}`)
    }
}

/**
 * Update vacation request for a doctor by vacation id and status
 *
 * @param {Number} vacationId
 * @param {Boolean} status
 *
 * @returns {Promise<Object>} - Response object
 *
 * @throws {Error} - When the response status is not 200
 */

export const updateVacationRequest = async (vacationId, status) => {
    try {
        return await api.put(`${domain}/DoctorVacation/UpdateVacation`, null, {
            params: { vacationId, status }
        })
    } catch (error) {
        throw new Error(`Error updating vacation request: ${error}`)
    }
}