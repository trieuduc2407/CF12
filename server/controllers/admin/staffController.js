import * as staffService from '../../services/admin/staffService.js'

export const addStaff = async (req, res) => {
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

    try {
        const newStaff = await staffService.addStaff({
            name,
            username,
            password,
            role,
        })
        res.json({
            success: true,
            message: 'Thêm nhân viên thành công',
            data: {
                name: newStaff.name,
                role: newStaff.role,
            },
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const getStaffById = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID nhân viên',
        })
    }

    try {
        const staff = await staffService.getStaffById(id)
        res.json({
            success: true,
            data: {
                name: staff.name,
                role: staff.role,
                id: staff._id,
            },
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: 'Server error',
        })
    }
}

export const getAllStaff = async (req, res) => {
    try {
        const staffs = await staffService.getAllStaffs()
        res.json({
            success: true,
            data: staffs,
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const updateStaff = async (req, res) => {
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

    let staff
    try {
        staff = await staffService.getStaffById(id)
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }

    try {
        const updateStaff = await staffService.updateStaff(id, { role })
        res.json({
            success: true,
            message: 'Cập nhật nhân viên thành công',
            data: {
                role: updateStaff.role,
            },
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}

export const deleteStaff = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.json({
            success: false,
            message: 'Vui lòng cung cấp ID nhân viên',
        })
    }

    let staff
    try {
        staff = await staffService.getStaffById(id)
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
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

    try {
        await staffService.deleteStaff(id)
        res.json({
            success: true,
            message: 'Xóa nhân viên thành công',
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
