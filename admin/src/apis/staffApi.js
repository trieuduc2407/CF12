import { crudHelpers } from '../helpers/apiHelpers'

const ENDPOINT = '/api/admin/staffs'

/**
 * Fetch all staff members
 * @returns {Promise<Array>} Array of staff
 */
export const fetchAllStaff = crudHelpers.getAll(ENDPOINT)

/**
 * Fetch staff by ID
 * @param {string} id - Staff ID
 * @returns {Promise<Object>} Staff data
 */
export const fetchStaffById = crudHelpers.getById(ENDPOINT)

/**
 * Create new staff member
 * @param {Object} staffData - Staff data
 * @returns {Promise<Object>} Created staff
 */
export const createStaff = crudHelpers.create(ENDPOINT)

/**
 * Update staff member
 * @param {Object} data - { id, formData }
 * @returns {Promise<Object>} Updated staff
 */
export const updateStaff = crudHelpers.update(ENDPOINT)

/**
 * Delete staff member
 * @param {string} id - Staff ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteStaff = crudHelpers.delete(ENDPOINT)
