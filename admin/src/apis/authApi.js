import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Login staff
 * @param {Object} credentials - { username, password }
 * @returns {Promise<Object>} Response data with token
 */
export const loginStaff = async (credentials) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/admin/auth/login`,
            credentials,
            { withCredentials: true }
        )

        if (response.data.success) {
            // Trả về toàn bộ response.data (bao gồm token nếu có)
            return response.data
        }

        throw new Error(response.data.message || 'Đăng nhập thất bại')
    } catch (error) {
        console.error('[authApi] loginStaff error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi đăng nhập'
        )
    }
}

/**
 * Logout staff
 * @returns {Promise<Object>} Logout result
 */
export const logoutStaff = async () => {
    try {
        const response = await axios.post(
            `${API_URL}/api/admin/auth/logout`,
            {},
            { withCredentials: true }
        )

        if (response.data.success) {
            return response.data
        }

        throw new Error(response.data.message || 'Đăng xuất thất bại')
    } catch (error) {
        console.error('[authApi] logoutStaff error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi đăng xuất'
        )
    }
}

/**
 * Get current staff info
 * @returns {Promise<Object>} Staff data
 */
export const getMe = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/auth/me`, {
            withCredentials: true,
        })

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(response.data.message || 'Không thể lấy thông tin user')
    } catch (error) {
        // Không log error 401 (chưa đăng nhập) - đây là expected behavior
        const status = error.response?.status
        if (status !== 401 && status !== 403) {
            console.error('[authApi] getMe error:', error)
        }
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi lấy thông tin user'
        )
    }
}

/**
 * Change password
 * @param {Object} payload - { id, formData: { oldPassword, newPassword } }
 * @returns {Promise<Object>} Change password result
 */
export const changePassword = async ({ id, formData }) => {
    try {
        const response = await axios.put(
            `${API_URL}/api/admin/auth/change-password/${id}`,
            formData,
            { withCredentials: true }
        )

        if (response.data.success) {
            return response.data
        }

        throw new Error(response.data.message || 'Đổi mật khẩu thất bại')
    } catch (error) {
        console.error('[authApi] changePassword error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi đổi mật khẩu'
        )
    }
}
