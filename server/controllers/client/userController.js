import * as userService from '../../services/userService.js'

export const findOrCreateUser = async (req, res) => {
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
            data: user,
        })
    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message || 'Server error',
        })
    }
}
