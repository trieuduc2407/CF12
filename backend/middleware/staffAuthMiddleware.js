import jwt from "jsonwebtoken"

const roles = ['employee', 'staff', 'admin']

const staffAuthMiddleware = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.json({
            success: false,
            message: "Chưa đăng nhập"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!roles.includes(decoded.role)) {
            return res.json({
                success: false,
                message: "Không đủ quyền truy cập"
            })
        }
        req.user = decoded
        next()
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Token không hợp lệ"
        })
    }
}

export { staffAuthMiddleware }