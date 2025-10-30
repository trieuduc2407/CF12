import * as authApi from '../apis/authApi.js'

export const checkAuth = async () => {
    try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            return false
        }

        // authApi.getMe đã trả về staff data nếu thành công
        await authApi.getMe()
        return true
    } catch {
        localStorage.removeItem('adminToken')
        return false
    }
}
