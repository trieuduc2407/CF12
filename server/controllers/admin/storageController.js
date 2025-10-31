// ===== IMPORTS =====
import { calculateMaxQuantity } from '../../helpers/admin/checkProductAvailability.js'
import * as storageService from '../../services/admin/storageService.js'

// ===== READ (GET) OPERATIONS =====
export const getIngredientById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({
                success: false,
                message: 'ID không hợp lệ',
            })
        }

        const ingredient = await storageService.getIngredientById(id)
        if (!ingredient) {
            return res.json({
                success: false,
                message: 'Nguyên liệu không tồn tại',
            })
        }

        return res.json({
            success: true,
            data: ingredient,
        })
    } catch (error) {
        console.error('[storageController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await storageService.getAllIngredients()
        return res.json({
            success: true,
            data: ingredients,
        })
    } catch (error) {
        console.error('[storageController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const searchIngredient = async (req, res) => {
    try {
        const { query } = req.query
        if (!query) {
            return res.json({
                success: false,
                message: 'Query không hợp lệ',
            })
        }

        const ingredients = await storageService.searchIngredient(query)
        return res.json({
            success: true,
            data: ingredients,
        })
    } catch (error) {
        console.error('[storageController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

// ===== CREATE OPERATIONS =====
export const addIngredient = async (req, res) => {
    try {
        const { name, quantity, unit, threshold } = req.body
        if (!name || quantity === null || !unit || threshold === null) {
            return res.json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin',
            })
        }

        const newIngredient = await storageService.addIngredient({
            name,
            quantity,
            unit,
            threshold,
        })
        return res.json({
            success: true,
            message: 'Thêm nguyên liệu thành công',
            data: newIngredient,
        })
    } catch (error) {
        console.error('[storageController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

// ===== UPDATE OPERATIONS =====
export const updateIngredient = async (req, res) => {
    try {
        const { id } = req.params
        const { name, quantity, unit, threshold } = req.body
        if (!id || !name || quantity === null || !unit || threshold === null) {
            return res.json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin',
            })
        }

        const result = await storageService.updateIngredient(id, {
            name,
            quantity,
            unit,
            threshold,
        })

        const { storage, changedProducts } = result

        const io = req.app.locals.io
        if (io) {
            // Emit storage warning nếu chạm threshold
            if (storage.quantity <= storage.threshold) {
                io.emit('storage:warning', {
                    ingredient: storage,
                    message: `Nguyên liệu "${storage.name}" sắp hết (${storage.quantity} ${storage.unit})`,
                })
            }

            // Emit product availability changes
            if (changedProducts.length > 0) {
                for (const result of changedProducts) {
                    io.emit('product:availability-changed', {
                        productId: result.product._id,
                        productName: result.product.name,
                        available: result.newAvailable,
                        maxQuantity: result.maxQuantity,
                    })
                }
            }
        }

        return res.json({
            success: true,
            message: 'Cập nhật nguyên liệu thành công',
            data: storage,
            affectedProducts: changedProducts.length,
        })
    } catch (error) {
        console.error('[storageController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

// ===== DELETE OPERATIONS =====
export const deleteIngredient = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({
                success: false,
                message: 'ID không hợp lệ',
            })
        }

        await storageService.deleteIngredient(id)
        return res.json({
            success: true,
            message: 'Xóa nguyên liệu thành công',
        })
    } catch (error) {
        console.error('[storageController] error:', error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
