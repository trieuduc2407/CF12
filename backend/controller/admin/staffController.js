import bcrypt from "bcrypt"
import { staffModel } from "../../model/staffModel.js"

const addStaff = async (req, res) => {
    const { name, username, password, role } = req.body
    try {
        if (req.user.role === 'staff' && role !== 'employee') {
            return res.json({
                success: false,
                message: "Bạn không có quyền tạo nhân viên với vai trò này"
            })
        }
        const checkExisting = await staffModel.findOne({ username })
        if (checkExisting) {
            return res.json({
                success: false,
                message: "Username đã tồn tại"
            })
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newStaff = new staffModel({ name, username, passwordHash, role, createdAt: Date.now() })
        await newStaff.save()
        res.json({
            success: true,
            message: "Thêm nhân viên thành công",
            data: {
                name: newStaff.name,
                role: newStaff.role
            }
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const getStaff = async (req, res) => {
    const { id } = req.params
    try {
        const staff = await staffModel.findById(id)
        if (!staff) {
            return res.json({
                success: false,
                message: "Nhân viên không tồn tại"
            })
        }
        res.json({
            success: true,
            data: {
                name: staff.name,
                role: staff.role
            }
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const fetchAllStaff = async (req, res) => {
    try {
        const staffs = await staffModel.find()
        res.json({
            success: true,
            data: staffs
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const updateStaff = async (req, res) => {
    const { id } = req.params
    const { role } = req.body
    try {
        const staff = await staffModel.findById(id)
        if (!staff) {
            return res.json({
                success: false,
                message: "Nhân viên không tồn tại"
            })
        }
        const updateStaff = await staffModel.findByIdAndUpdate(id, { role }, { new: true })
        res.json({
            success: true,
            message: "Cập nhật nhân viên thành công",
            data: {
                role: updateStaff.role
            }
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const deleteStaff = async (req, res) => {
    const { id } = req.params
    try {
        const staff = await staffModel.findById(id)

        if (!staff) {
            return res.json({
                success: false,
                message: "Nhân viên không tồn tại"
            })
        }

        if (req.user.role === 'staff') {
            if (staff.role !== 'employee') {
                return res.json({
                    success: false,
                    message: "Không đủ quyền xóa nhân viên này"
                })
            }
        }

        await staffModel.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Xóa nhân viên thành công"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const changePassword = async (req, res) => {
    const { id } = req.params
    const { password, newPassword } = req.body
    try {
        const staff = await staffModel.findById(id)
        if (!staff) {
            return res.json({
                success: false,
                message: "Nhân viên không tồn tại"
            })
        }
        const checkPassword = await bcrypt.compare(password, staff.passwordHash)
        if (!checkPassword) {
            return res.json({
                success: false,
                message: "Mật khẩu không đúng"
            })
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 10)
        staff.passwordHash = newPasswordHash
        await staff.save()
        res.json({
            success: true,
            message: "Đổi mật khẩu thành công"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

export { addStaff, getStaff, fetchAllStaff, updateStaff, deleteStaff, changePassword }