// ===== IMPORTS =====
import bcrypt from 'bcrypt'

import { staffModel } from '../../models/staffModel.js'

// ===== READ (GET) OPERATIONS =====
export const getStaffById = async (id) => {
    try {
        const existingStaff = await staffModel.findById(id)
        if (!existingStaff) {
            throw new Error('Nhân viên không tồn tại')
        }

        return {
            name: existingStaff.name,
            role: existingStaff.role,
            _id: existingStaff._id,
        }
    } catch (error) {
        throw new Error(
            `Xảy ra lỗi khi lấy thông tin nhân viên: ${error.message}`
        )
    }
}

export const getAllStaffs = async () => {
    try {
        const staffs = await staffModel.find({}, { name: 1, role: 1 })
        return staffs
    } catch (error) {
        throw new Error(
            `Xảy ra lỗi khi lấy danh sách nhân viên: ${error.message}`
        )
    }
}

// ===== CREATE OPERATIONS =====
export const addStaff = async (data) => {
    try {
        const { username, password } = data

        const checkExisting = await staffModel.findOne({ username })
        if (checkExisting) {
            throw new Error('Username đã tồn tại')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const newStaff = await staffModel.create({
            ...data,
            passwordHash,
        })
        return newStaff
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi thêm nhân viên: ${error.message}`)
    }
}

// ===== UPDATE OPERATIONS =====
export const updateStaff = async (id, data) => {
    try {
        const updatedStaff = await staffModel.findByIdAndUpdate(id, data, {
            new: true,
        })
        return updatedStaff
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi cập nhật nhân viên: ${error.message}`)
    }
}

// ===== DELETE OPERATIONS =====
export const deleteStaff = async (id) => {
    try {
        const existingStaff = await staffModel.findById(id)
        if (!existingStaff) {
            throw new Error('Nhân viên không tồn tại')
        }

        await staffModel.findByIdAndDelete(id)
        return true
    } catch (error) {
        throw new Error(`Xảy ra lỗi khi xóa nhân viên: ${error.message}`)
    }
}
