import { storageModel } from "../../models/storageModel.js"

const addIngredient = async (req, res) => {
    const { name, quantity, unit, threshold } = req.body
    try {
        const checkExisting = await storageModel.findOne({ name })

        if (checkExisting) {
            return res.json({
                success: false,
                message: "Nguyên liệu đã tồn tại"
            })
        }

        const newIngredient = new storageModel({ name, quantity, unit, threshold, updatedAt: Date.now() })
        await newIngredient.save()
        res.json({
            success: true,
            message: "Thêm nguyên liệu thành công"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const getIngredient = async (req, res) => {
    const { id } = req.params
    try {
        const ingredient = await storageModel.findById(id)

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
            message: "Server error"
        })
    }
}

const getAllIngredient = async (req, res) => {
    try {
        const ingredients = await storageModel.find()
        res.json({
            success: true,
            data: ingredients
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const updateIngredient = async (req, res) => {
    const { id } = req.params
    const { name, quantity, unit, threshold } = req.body
    try {
        const checkName = await storageModel.findOne({ name, _id: { $ne: id } })

        if (checkName) {
            return res.json({
                success: false,
                message: "Tên nguyên liệu đã tồn tại"
            })
        }

        const updatedIngredient = await storageModel.findByIdAndUpdate(
            id,
            { name, quantity, unit, threshold, updatedAt: Date.now() },
            { new: true }
        )
        res.json({
            success: true,
            message: "Cập nhật nguyên liệu thành công",
            data: updatedIngredient
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const deleteIngredient = async (req, res) => {
    const { id } = req.params
    try {
        const ingredient = await storageModel.findById(id)

        if (!ingredient) {
            return res.json({
                success: false,
                message: "Nguyên liệu không tồn tại"
            })
        }

        await storageModel.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Xóa nguyên liệu thành công",
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

export { addIngredient, getIngredient, getAllIngredient, updateIngredient, deleteIngredient }
