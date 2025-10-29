import { userModel } from '../../models/userModel.js'

export const findOrCreateUser = async (userData) => {
    try {
        const { name, phone } = userData
        let user = await userModel.findOne({ phone })
        if (!user) user = await userModel.create({ name, phone })

        return user
    } catch (error) {
        throw new Error('Xay ra lỗi khi tìm hoặc tạo mới người dùng')
    }
}
