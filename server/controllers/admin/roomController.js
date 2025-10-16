import * as roomService from '../../services/admin/roomService.js'

export const addRoom = async (req, res) => {
    const { tableId, status } = req.body
    if (!tableId || !status) {
        return res.json({
            success: false,
            message: "Vui lòng cung cấp đầy đủ thông tin"
        })
    }

    try {
        const newRoom = await roomService.addRoom({
            tableId,
            status
        })
        return res.json({
            success: true,
            data: newRoom
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms()
        return res.json({
            success: true,
            data: rooms
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const getRoomById = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: "Vui lòng cung cấp ID phòng"
        })
    }

    try {
        const room = await roomService.getRoomById(id)
        if (!room) {
            return res.json({
                success: false,
                message: "Không tìm thấy phòng"
            })
        }

        return res.json({
            success: true,
            data: room
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const updateRoom = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: "Vui lòng cung cấp ID phòng"
        })
    }

    const { tableId, status } = req.body
    if (!tableId || !status) {
        return res.json({
            success: false,
            message: "Vui lòng cung cấp đầy đủ thông tin"
        })
    }

    try {
        const updatedRoom = await roomService.updateRoom(id, {
            tableId,
            status
        })
        return res.json({
            success: true,
            data: updatedRoom
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const deleteRoom = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: "Vui lòng cung cấp ID phòng"
        })
    }

    try {
        await roomService.deleteRoom(id)
        return res.json({
            success: true,
            message: "Xóa phòng thành công"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}

export const updateActiveCartId = async (req, res) => {
    const { tableId } = req.params
    if (!tableId) {
        return res.json({
            success: false,
            message: "Vui lòng cung cấp tableId"
        })
    }

    const { activeCartId } = req.body
    if (!activeCartId) {
        return res.json({
            success: false,
            message: "Vui lòng cung cấp activeCartId"
        })
    }

    try {
        const updatedRoom = await roomService.updateActiveCartId(tableId, activeCartId)
        return res.json({
            success: true,
            data: updatedRoom
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Server error"
        })
    }
}
