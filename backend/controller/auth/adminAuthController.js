import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { staffModel } from "../../model/staffModel.js"

const me = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.json({
                success: false,
                message: "Chưa đăng nhập"
            })
        }
        const staff = await staffModel.findById(req.user.id)
        if (!staff) {
            return res.json({
                success: false,
                message: "Không tìm thấy nhân viên"
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
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

const loginStaff = async (req, res) => {
    const { username, password } = req.body
    try {
        const checkStaff = await staffModel.findOne({ username })
        if (!checkStaff) {
            return res.json({
                success: false,
                message: "Sai tên đăng nhập"
            })
        }
        const checkPassword = await bcrypt.compare(password, checkStaff.passwordHash)
        if (!checkPassword) {
            return res.json({
                success: false,
                message: "Sai mật khẩu"
            })
        }
        const token = jwt.sign(
            {
                id: checkStaff._id,
                role: checkStaff.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            })
        res.cookie('token', token, {
            httpOnly: true,
            secure: false
        }).json({
            success: true,
            message: "Đăng nhập thành công",
            data: {
                username: checkStaff.username,
                role: checkStaff.role,
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

const logoutStaff = async (req, res) => {
    try {
        res.clearCookie('token').json({
            success: true,
            message: "Đăng xuất thành công"
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Server error"
        })
    }
}

export { loginStaff, logoutStaff, me }