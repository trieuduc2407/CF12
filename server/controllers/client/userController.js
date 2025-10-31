import * as userService from '../../services/client/userService.js'

export const login = async (req, res) => {
    try {
        const { name, phone } = req.body
        if (!name) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp tên người dùng',
            })
        }

        if (!phone) {
            return res.json({
                success: false,
                message: 'Vui lòng cung cấp số điện thoại',
            })
        }

        const user = await userService.findOrCreateUser({ name, phone })

        return res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                userId: user._id,
                name: user.name,
                phone: user.phone,
                points: user.points,
            },
        })
    } catch (error) {
        console.error(' login error:', error)
        return res.json({
            success: false,
            message: error.message || 'Lỗi khi đăng nhập',
        })
    }
}

