import { tableModel } from "../../models/tableModel.js"

export const addTable = async (data) => {
    try {
        const newTable = await tableModel.create(data)
        return newTable
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi thêm bàn: ${error.message}`)
    }
}

export const getAllTables = async () => {
    try {
        const tables = await tableModel.find()
        return tables
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy danh sách bàn: ${error.message}`)
    }
}

export const getTableById = async (id) => {
    try {
        const table = await tableModel.findById(id)
        return table
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy thông tin bàn: ${error.message}`)
    }
}

export const updateTable = async (id, data) => {
    try {
        const updatedTable = await tableModel.findByIdAndUpdate(id, data, { new: true })
        return updatedTable
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi cập nhật bàn: ${error.message}`)
    }
}

export const deleteTable = async (id) => {
    try {
        await tableModel.findByIdAndDelete(id)
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi xóa bàn: ${error.message}`)
    }
}

export const updateActiveCartId = async (tableName, activeCartId) => {
    try {
        const updatedTable = await tableModel.findOneAndUpdate(
            { tableName },
            { activeCartId },
            { new: true }
        )
        return updatedTable
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi cập nhật activeCartId: ${error.message}`)
    }
}