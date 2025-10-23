import axios from 'axios'

export const checkAuth = async () => {
    try {
        // Kiểm tra token trong localStorage trước
        const token = localStorage.getItem('adminToken')
        if (!token) {
            return false
        }

        // Xác thực token với backend
        const res = await axios.get(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/auth/me'
        )
        return res.data?.success === true
    } catch {
        // Xóa token không hợp lệ
        localStorage.removeItem('adminToken')
        return false
    }
}
