import { crudHelpers } from '../helpers/apiHelpers'

const ENDPOINT = '/api/admin/storages'

/**
 * Fetch all ingredients
 * @returns {Promise<Array>} Array of ingredients
 */
export const fetchAllIngredients = crudHelpers.getAll(ENDPOINT)

/**
 * Fetch ingredient by ID
 * @param {string} id - Ingredient ID
 * @returns {Promise<Object>} Ingredient data
 */
export const fetchIngredientById = crudHelpers.getById(ENDPOINT)

/**
 * Create new ingredient
 * @param {Object} ingredientData - Ingredient data
 * @returns {Promise<Object>} Created ingredient
 */
export const createIngredient = crudHelpers.create(ENDPOINT)

/**
 * Update ingredient
 * @param {Object} data - { id, formData }
 * @returns {Promise<Object>} Updated ingredient
 */
export const updateIngredient = crudHelpers.update(ENDPOINT)

/**
 * Delete ingredient
 * @param {string} id - Ingredient ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteIngredient = crudHelpers.delete(ENDPOINT)

/**
 * Search ingredients
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of ingredients
 */
export const searchIngredients = crudHelpers.search(ENDPOINT)
