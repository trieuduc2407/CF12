// ===== IMPORTS =====
import * as staffService from '../../services/admin/staffService.js'

// ===== READ (GET) OPERATIONS =====
export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp ID nhân viên',
            })
        }

        const staff = await staffService.getStaffById(id)
        return res.json({
            success: true,
            data: {
                name: staff.name,
                role: staff.role,
                id: staff._id,
            },
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getAllStaff = async (req, res) => {
    try {
        const staffs = await staffService.getAllStaffs()
        return res.json({
            success: true,
            data: staffs,
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

// ===== CREATE OPERATIONS =====
export const addStaff = async (req, res) => {
    try {
        const { name, username, password, role } = req.body

        if (req.user.role === 'staff' && role !== 'employee') {
            return res.json({
                success: false,
                message: 'Bạn không có quyền tạo nhân viên với vai trò này',
            })
        }

        if (!name || !username || !password || !role) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp đầy đủ thông tin',
            })
        }

        const newStaff = await staffService.addStaff({
            name,
            username,
            password,
            role,
        })
        return res.json({
            success: true,
            message: 'Thêm nhân viên thành công',
            data: {
                name: newStaff.name,
                role: newStaff.role,
            },
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

// ===== UPDATE OPERATIONS =====
export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp ID nhân viên',
            })
        }

        const { role } = req.body
        if (!role) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp vai trò',
            })
        }

        if (req.user.role === 'staff' && role !== 'employee') {
            return res.json({
                success: false,
                message: 'Bạn không có quyền cập nhật vai trò này',
            })
        }

        await staffService.getStaffById(id)
        const updateStaff = await staffService.updateStaff(id, { role })
        return res.json({
            success: true,
            message: 'Cập nhật nhân viên thành công',
            data: {
                role: updateStaff.role,
            },
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

// ===== DELETE OPERATIONS =====
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp ID nhân viên',
            })
        }

        const staff = await staffService.getStaffById(id)
        if (!staff) {
            return res.json({
                success: false,
                message: 'Nhân viên không tồn tại',
            })
        }

        if (req.user.role === 'staff') {
            if (staff.role !== 'employee') {
                return res.json({
                    success: false,
                    message: 'Không đủ quyền xóa nhân viên này',
                })
            }
        }

        await staffService.deleteStaff(id)
        return res.json({
            success: true,
            message: 'Xóa nhân viên thành công',
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
