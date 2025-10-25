import * as orderService from '../../services/client/orderService.js'
import * as sessionService from '../../services/client/sessionService.js'

/**
 * GET /api/admin/orders
 * Lấy tất cả orders với filters
 */
export const getAllOrders = async (req, res) => {
    try {
        const { status, tableName, startDate, endDate, sessionId } = req.query

        const filters = {}
        if (status) filters.status = status
        if (tableName) filters.tableName = tableName
        if (startDate) filters.startDate = startDate
        if (endDate) filters.endDate = endDate
        if (sessionId) filters.sessionId = sessionId

        const orders = await orderService.getAllOrders(filters)

        return res.status(200).json({
            success: true,
            data: orders,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy danh sách orders',
        })
    }
}

/**
 * GET /api/admin/orders/:orderId
 * Lấy chi tiết order
 */
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params

        const order = await orderService.getOrderById(orderId)

        return res.status(200).json({
            success: true,
            data: order,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy chi tiết order',
        })
    }
}

/**
 * PATCH /api/admin/orders/:orderId/status
 * Cập nhật trạng thái order
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const staffId = req.staff?._id // Từ auth middleware

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin trạng thái',
            })
        }

        const order = await orderService.updateOrderStatus(
            orderId,
            status,
            staffId
        )

        // Emit socket event cho client
        const io = req.app.locals.io
        if (io) {
            io.to(order.tableName).emit('order:statusUpdated', {
                orderId: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái order thành công',
            data: order,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi cập nhật trạng thái order',
        })
    }
}

/**
 * GET /api/admin/sessions
 * Lấy tất cả sessions với filters
 */
export const getAllSessions = async (req, res) => {
    try {
        const { status, tableName, startDate, endDate } = req.query

        const filters = {}
        if (status) filters.status = status
        if (tableName) filters.tableName = tableName
        if (startDate) filters.startDate = startDate
        if (endDate) filters.endDate = endDate

        const sessions = await sessionService.getAllSessions(filters)

        return res.status(200).json({
            success: true,
            data: sessions,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy danh sách sessions',
        })
    }
}

/**
 * GET /api/admin/sessions/:sessionId
 * Lấy chi tiết session
 */
export const getSessionById = async (req, res) => {
    try {
        const { sessionId } = req.params

        const session = await sessionService.getSessionDetails(sessionId)

        return res.status(200).json({
            success: true,
            data: session,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy chi tiết session',
        })
    }
}

/**
 * PATCH /api/admin/sessions/:sessionId/cancel
 * Hủy session
 */
export const cancelSession = async (req, res) => {
    try {
        const { sessionId } = req.params

        const session = await sessionService.cancelSession(sessionId)

        return res.status(200).json({
            success: true,
            message: 'Hủy session thành công',
            data: session,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi hủy session',
        })
    }
}
