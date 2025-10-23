import axios from 'axios'

export const checkAuth = async () => {
    try {
        const res = await axios.get(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/auth/me',
        )
        return res.data?.success === true
    } catch (error) {
        console.error('Lỗi xác thực:', error)
        return false
    }
}
