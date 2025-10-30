import { apiRequest, crudHelpers } from '../helpers/apiHelpers'

const ENDPOINT = '/api/admin/products'

/**
 * Fetch all products
 * @returns {Promise<Array>} Array of products
 */
export const fetchAllProducts = crudHelpers.getAll(ENDPOINT)

/**
 * Fetch product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Product data
 */
export const fetchProductById = crudHelpers.getById(ENDPOINT)

/**
 * Create new product
 * @param {FormData} formData - Product form data
 * @returns {Promise<Object>} Created product
 */
export const createProduct = crudHelpers.create(ENDPOINT, 'multipart/form-data')

/**
 * Update product
 * @param {Object} data - { id, formData }
 * @returns {Promise<Object>} Updated product
 */
export const updateProduct = crudHelpers.update(ENDPOINT, 'multipart/form-data')

/**
 * Delete product
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteProduct = crudHelpers.delete(ENDPOINT)

/**
 * Search products
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of products
 */
export const searchProducts = crudHelpers.search(ENDPOINT)

/**
 * Toggle product signature status
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} Updated product
 */
export const toggleProductSignature = async (productId) => {
    return await apiRequest('PUT', `${ENDPOINT}/toggle-signature/${productId}`)
}
