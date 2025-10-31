import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Fetch all orders with optional filters
 * @param {Object} filters - { status, tableName, startDate, endDate }
 * @returns {Promise<Array>} Array of orders
 */
export const fetchAllOrders = async (filters = {}) => {
    try {
        const params = new URLSearchParams()

        // Add filters to query params
        if (filters.status && filters.status !== 'all') {
            params.append('status', filters.status)
        }
        if (filters.tableName) {
            params.append('tableName', filters.tableName)
        }
        if (filters.startDate) {
            params.append('startDate', filters.startDate)
        }
        if (filters.endDate) {
            params.append('endDate', filters.endDate)
        }

        const response = await axios.get(
            `${API_URL}/api/admin/orders?${params.toString()}`,
            {
                withCredentials: true,
            }
        )

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(
            response.data.message || 'Không thể tải danh sách đơn hàng'
        )
    } catch (error) {
        console.error('[orderApi] fetchAllOrders error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi tải danh sách đơn hàng'
        )
    }
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {string} staffId - Staff ID (optional)
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status, staffId = null) => {
    try {
        const payload = { status }
        if (staffId) {
            payload.staffId = staffId
        }

        const response = await axios.patch(
            `${API_URL}/api/admin/orders/${orderId}/status`,
            payload,
            { withCredentials: true }
        )

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(
            response.data.message || 'Không thể cập nhật trạng thái đơn hàng'
        )
    } catch (error) {
        console.error('[orderApi] updateOrderStatus error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi cập nhật trạng thái đơn hàng'
        )
    }
}

/**
 * Get payment preview for order (DEPRECATED - use session payment)
 * @param {string} orderId - Order ID
 * @param {string} phone - Customer phone
 * @param {number} pointsToUse - Points to use
 * @returns {Promise<Object>} Payment preview
 */
export const getPaymentPreview = async (orderId, phone, pointsToUse = 0) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/admin/orders/${orderId}/payment-preview`,
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
        console.error('[orderApi] getPaymentPreview error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi tải preview thanh toán'
        )
    }
}

/**
 * Process payment for order (DEPRECATED - use session payment)
 * @param {string} orderId - Order ID
 * @param {Object} paymentData - Payment data
 * @returns {Promise<Object>} Payment result
 */
export const processPayment = async (orderId, paymentData) => {
    try {
        const response = await axios.patch(
            `${API_URL}/api/admin/orders/${orderId}/checkout`,
            paymentData,
            { withCredentials: true }
        )

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(response.data.message || 'Thanh toán thất bại')
    } catch (error) {
        console.error('[orderApi] processPayment error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi thanh toán'
        )
    }
}

/**
 * Cancel order (admin only)
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Cancelled order
 */
export const cancelOrder = async (orderId) => {
    try {
        const response = await axios.patch(
            `${API_URL}/api/admin/orders/${orderId}/cancel`,
            {},
            { withCredentials: true }
        )

        if (response.data.success) {
            return response.data.data
        }

        throw new Error(response.data.message || 'Không thể hủy đơn hàng')
    } catch (error) {
        console.error('[orderApi] cancelOrder error:', error)
        throw new Error(
            error.response?.data?.message ||
                error.message ||
                'Lỗi khi hủy đơn hàng'
        )
    }
}
