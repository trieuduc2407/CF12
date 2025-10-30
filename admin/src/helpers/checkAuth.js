import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const checkAuth = async () => {
    try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            return false
        }

        const res = await axios.get(`${API_URL}/api/admin/auth/me`)
        return res.data?.success === true
    } catch {
        localStorage.removeItem('adminToken')
        return false
    }
}
