import { userModel } from '../../models/userModel.js'

export const findUserByPhone = async (phone) => {
    try {
        const user = await userModel.findOne({ phone })
        return user
    } catch (error) {
        throw new Error('Xảy ra lỗi khi tìm người dùng')
    }
}

export const findOrCreateUser = async (userData) => {
    try {
        const { name, phone } = userData
        let user = await userModel.findOne({ phone })
        if (!user) user = await userModel.create({ name, phone })

        return user
    } catch (error) {
        throw new Error('Xảy ra lỗi khi tìm hoặc tạo mới người dùng')
    }
}
