import * as storageService from '../../services/admin/storageService.js'

export const addIngredient = async (req, res) => {
    const { name, quantity, unit, threshold } = req.body
    try {
        if (!name || quantity === null || !unit || threshold === null) {
            return res.json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin"
            })
        }

        const newIngredient = await storageService.addIngredient({
            name,
            quantity,
            unit,
            threshold
        })
        res.json({
            success: true,
            message: "Thêm nguyên liệu thành công",
            data: newIngredient
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const getIngredientById = async (req, res) => {
    const { id } = req.params
    try {
        if (!id) {
            return res.json({
                success: false,
                message: "ID không hợp lệ"
            })
        }

        const ingredient = await storageService.getIngredientById(id)
        if (!ingredient) {
            return res.json({
                success: false,
                message: "Nguyên liệu không tồn tại"
            })
        }
        res.json({
            success: true,
            data: ingredient
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await storageService.getAllIngredients()
        res.json({
            success: true,
            data: ingredients
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const updateIngredient = async (req, res) => {
    const { id } = req.params
    const { name, quantity, unit, threshold } = req.body
    try {
        if (!id || !name || quantity === null || !unit || threshold === null) {
            return res.json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin"
            })
        }

        const updatedIngredient = await storageService.updateIngredient(id, {
            name,
            quantity,
            unit,
            threshold
        })
        res.json({
            success: true,
            message: "Cập nhật nguyên liệu thành công",
            data: updatedIngredient
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const deleteIngredient = async (req, res) => {
    const { id } = req.params
    try {
        if (!id) {
            return res.json({
                success: false,
                message: "ID không hợp lệ"
            })
        }

        await storageService.deleteIngredient(id)
        res.json({
            success: true,
            message: "Xóa nguyên liệu thành công",
        })
    } catch (error) {
        console.log(error)

        res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const searchIngredient = async (req, res) => {
    const { query } = req.query
    try {
        if (!query) {
            return res.json({
                success: false,
                message: "Query không hợp lệ"
            })
        }

        const ingredients = await storageService.searchIngredient(query)
        res.json({
            success: true,
            data: ingredients
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

