import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Fetch all sessions with optional status and date filter
 * @param {string} status - Filter by status: 'all', 'active', 'completed', 'cancelled'
 * @param {string} date - Filter by date (YYYY-MM-DD format)
 * @returns {Promise<Array>} Array of sessions
 */
export const fetchSessions = async (status = 'all', date = null) => {
    try {
        const params = new URLSearchParams()
        if (status !== 'all') {
            params.append('status', status)
        }
        if (date) {
            params.append('date', date)
        }

        const response = await axios.get(
            `${API_URL}/api/admin/sessions?${params.toString()}`,
            {
                withCredentials: true, // Để gửi cookie xác thực
            }
        )

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(
            response.data.message || 'Không thể tải danh sách phiên'
        )
    } catch (error) {
        console.error('[sessionApi] fetchSessions error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi tải danh sách phiên'
        )
    }
}

/**
 * Fetch single session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session object
 */
export const fetchSessionById = async (sessionId) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/admin/sessions/${sessionId}`,
            {
                withCredentials: true,
            }
        )

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(response.data.message || 'Không tìm thấy phiên')
    } catch (error) {
        console.error('[sessionApi] fetchSessionById error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi tải thông tin phiên'
        )
    }
}

/**
 * Get payment preview for session
 * @param {string} sessionId - Session ID
 * @param {string} phone - Customer phone
 * @param {number} pointsToUse - Points to use
 * @returns {Promise<Object>} Payment preview data
 */
export const getSessionPaymentPreview = async (
    sessionId,
    phone,
    pointsToUse = 0
) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/admin/sessions/${sessionId}/payment-preview`,
            {
                params: { phone, pointsToUse },
                withCredentials: true,
            }
        )

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(
            response.data.message || 'Không thể tải preview thanh toán'
        )
    } catch (error) {
        console.error('[sessionApi] getSessionPaymentPreview error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi tải preview thanh toán'
        )
    }
}

/**
 * Checkout session (process payment)
 * @param {string} sessionId - Session ID
 * @param {Object} paymentData - { phone, name, pointsToUse }
 * @returns {Promise<Object>} Payment result
 */
export const checkoutSession = async (sessionId, paymentData) => {
    try {
        const response = await axios.patch(
            `${API_URL}/api/admin/sessions/${sessionId}/checkout`,
            paymentData,
            { withCredentials: true }
        )

        if (response.data.success) {
            return response.data
        }

        throw new Error(response.data.message || 'Thanh toán thất bại')
    } catch (error) {
        console.error('[sessionApi] checkoutSession error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi thanh toán'
        )
    }
}
