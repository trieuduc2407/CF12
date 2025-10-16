import { roomModel } from "../../models/roomModel.js"

export const addRoom = async (data) => {
    try {
        const newRoom = await roomModel.create(data)
        return newRoom
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi thêm phòng: ${error.message}`)
    }
}

export const getAllRooms = async () => {
    try {
        const rooms = await roomModel.find()
        return rooms
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy danh sách phòng: ${error.message}`)
    }
}

export const getRoomById = async (id) => {
    try {
        const room = await roomModel.findById(id)
        return room
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi lấy thông tin phòng: ${error.message}`)
    }
}

export const updateRoom = async (id, data) => {
    try {
        const updatedRoom = await roomModel.findByIdAndUpdate(id, data, { new: true })
        return updatedRoom
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi cập nhật phòng: ${error.message}`)
    }
}

export const deleteRoom = async (id) => {
    try {
        await roomModel.findByIdAndDelete(id)
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi xóa phòng: ${error.message}`)
    }
}

export const updateActiveCartId = async (tableId, activeCartId) => {
    try {
        const updatedRoom = await roomModel.findOneAndUpdate(
            { tableId },
            { activeCartId },
            { new: true }
        )
        return updatedRoom
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi cập nhật activeCartId: ${error.message}`)
    }
}