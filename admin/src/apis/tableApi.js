import { crudHelpers } from '../helpers/apiHelpers'

const ENDPOINT = '/api/admin/tables'

/**
 * Fetch all tables
 * @returns {Promise<Array>} Array of tables
 */
export const fetchAllTables = crudHelpers.getAll(ENDPOINT)

/**
 * Fetch table by ID
 * @param {string} id - Table ID
 * @returns {Promise<Object>} Table data
 */
export const fetchTableById = crudHelpers.getById(ENDPOINT)

/**
 * Create new table
 * @param {Object} tableData - Table data
 * @returns {Promise<Object>} Created table
 */
export const createTable = crudHelpers.create(ENDPOINT)

/**
 * Update table
 * @param {Object} data - { id, formData }
 * @returns {Promise<Object>} Updated table
 */
export const updateTable = crudHelpers.update(ENDPOINT)

/**
 * Delete table
 * @param {string} id - Table ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteTable = crudHelpers.delete(ENDPOINT)
