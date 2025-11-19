// ===== IMPORTS =====
import { updateProductsUsingStorage } from '../../helpers/admin/checkProductAvailability.js'
import { storageModel } from '../../models/storageModel.js'

// ===== READ (GET) OPERATIONS =====
export const getIngredientById = async (id) => {
    try {
        const ingredient = await storageModel.findById(id)
        if (!ingredient) {
            throw new Error('Nguyên liệu không tồn tại')
        }
        return ingredient
    } catch (error) {
        throw new Error(
            `Xảy ra lỗi khi lấy nguyên liệu theo ID: ${error.message}`
        )
    }
}

export const getAllIngredients = async () => {
    try {
        return await storageModel.find()
    } catch (error) {
        throw new Error(
            `Xảy ra lỗi khi lấy tất cả nguyên liệu: ${error.message}`
        )
    }
}

export const searchIngredient = async (query) => {
    try {
        const ingredients = await storageModel.find({
            name: { $regex: query, $options: 'i' },
        })
        return ingredients
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi tìm kiếm nguyên liệu: ${error.message}`)
    }
}

// ===== CREATE OPERATIONS =====
export const addIngredient = async (data) => {
    const { name } = data
    const existingIngredient = await storageModel.findOne({ name })
    if (existingIngredient) {
        throw new Error('Nguyên liệu đã tồn tại')
    }

    try {
        const newIngredient = await storageModel.create(data)
        return newIngredient
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi thêm nguyên liệu: ${error.message}`)
    }
}

// ===== UPDATE OPERATIONS =====
export const importIngredient = async (id, importQuantity) => {
    try {
        const existingIngredient = await storageModel.findById(id)
        if (!existingIngredient) {
            throw new Error('Nguyên liệu không tồn tại')
        }

        const oldQuantity = existingIngredient.quantity
        const newQuantity = oldQuantity + Number(importQuantity)

        const updatedIngredient = await storageModel.findByIdAndUpdate(
            id,
            {
                quantity: newQuantity,
                updatedAt: Date.now(),
            },
            { new: true }
        )

        const threshold = updatedIngredient.threshold
        let changedProducts = []

        if (
            newQuantity <= threshold ||
            (oldQuantity <= threshold && newQuantity > threshold)
        ) {
            changedProducts = await updateProductsUsingStorage(
                updatedIngredient._id
            )
        }

        return { storage: updatedIngredient, changedProducts, importQuantity }
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi nhập hàng: ${error.message}`)
    }
}

export const updateIngredient = async (id, data) => {
    try {
        const existingIngredient = await storageModel.findById(id)
        if (!existingIngredient) {
            throw new Error('Nguyên liệu không tồn tại')
        }

        const checkName = await storageModel.findOne({
            name: data.name,
            _id: { $ne: id },
        })
        if (checkName) {
            throw new Error('Tên nguyên liệu đã tồn tại')
        }

        const oldQuantity = existingIngredient.quantity

        const updatedIngredient = await storageModel.findByIdAndUpdate(
            id,
            {
                ...data,
                updatedAt: Date.now(),
            },
            { new: true }
        )

        const newQuantity = updatedIngredient.quantity
        const threshold = updatedIngredient.threshold

        let changedProducts = []

        if (
            newQuantity <= threshold ||
            (oldQuantity <= threshold && newQuantity > threshold)
        ) {
            changedProducts = await updateProductsUsingStorage(
                updatedIngredient._id
            )
        }

        return { storage: updatedIngredient, changedProducts }
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi cập nhật nguyên liệu: ${error.message}`)
    }
}

// ===== DELETE OPERATIONS =====
export const deleteIngredient = async (id) => {
    try {
        const existingIngredient = await storageModel.findById(id)
        if (!existingIngredient) {
            throw new Error('Nguyên liệu không tồn tại')
        }

        await storageModel.findByIdAndDelete(id)
        return true
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi xóa nguyên liệu: ${error.message}`)
    }
}
