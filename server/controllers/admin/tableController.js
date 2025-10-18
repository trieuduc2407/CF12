import * as tableService from '../../services/admin/tableService.js'

export const addTable = async (req, res) => {
    const { tableName, status } = req.body
    if (!tableName || !status) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp đầy đủ thông tin',
        })
    }

    try {
        const newTable = await tableService.addTable({
            tableName,
            status,
        })
        return res.json({
            success: true,
            data: newTable,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getAllTables = async (req, res) => {
    try {
        const tables = await tableService.getAllTables()
        return res.json({
            success: true,
            data: tables,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getTableById = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID bàn',
        })
    }

    try {
        const table = await tableService.getTableById(id)
        if (!table) {
            return res.json({
                success: false,
                message: 'Không tìm thấy bàn',
            })
        }

        return res.json({
            success: true,
            data: table,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const updateTable = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID bàn',
        })
    }

    const { tableName, status } = req.body
    if (!tableName || !status) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp đầy đủ thông tin',
        })
    }

    try {
        const updatedTable = await tableService.updateTable(id, {
            tableName,
            status,
        })
        return res.json({
            success: true,
            data: updatedTable,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const deleteTable = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID bàn',
        })
    }

    try {
        await tableService.deleteTable(id)
        return res.json({
            success: true,
            message: 'Xóa bàn thành công',
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const updateActiveCartId = async (req, res) => {
    const { tableId } = req.params
    if (!tableId) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp tableId',
        })
    }

    const { activeCartId } = req.body
    if (!activeCartId) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp activeCartId',
        })
    }

    try {
        const updatedTable = await tableService.updateActiveCartId(
            tableId,
            activeCartId
        )
        return res.json({
            success: true,
            data: updatedTable,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
