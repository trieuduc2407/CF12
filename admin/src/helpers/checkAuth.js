import axios from 'axios'

export const checkAuth = async () => {
    try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            return false
        }

        const res = await axios.get(
            import.meta.env.VITE_BACKEND_URL + '/api/admin/auth/me'
        )
        return res.data?.success === true
    } catch {
        localStorage.removeItem('adminToken')
        return false
    }
}
