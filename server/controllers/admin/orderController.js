import {
    calculatePaymentPreview,
    getMaxUsablePoints,
    getPointsForRoundPrice,
} from '../../helpers/client/calculatePoints.js'
import * as orderService from '../../services/client/orderService.js'
import * as sessionService from '../../services/client/sessionService.js'
import { findUserByPhone } from '../../services/client/userService.js'

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

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body
        const staffId = req.staff?._id

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

export const getAllSessions = async (req, res) => {
    try {
        const { status, tableName, startDate, endDate, date } = req.query

        const filters = {}
        if (status) filters.status = status
        if (tableName) filters.tableName = tableName

        // Nếu có tham số date, ưu tiên lọc theo ngày cụ thể
        if (date) {
            // Lọc session bắt đầu trong ngày này
            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)

            filters.startDate = startOfDay.toISOString()
            filters.endDate = endOfDay.toISOString()
        } else {
            if (startDate) filters.startDate = startDate
            if (endDate) filters.endDate = endDate
        }

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

export const getSessionPaymentPreview = async (req, res) => {
    try {
        const { sessionId } = req.params
        const { phone, pointsToUse = 0 } = req.query

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin số điện thoại',
            })
        }

        const result = await sessionService.getSessionPaymentPreview(
            sessionId,
            phone,
            parseInt(pointsToUse)
        )

        return res.status(200).json({
            success: true,
            data: result,
        })
    } catch (error) {
        console.error(
            '[orderController] getSessionPaymentPreview error:',
            error
        )
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tính toán preview',
        })
    }
}

export const checkoutSession = async (req, res) => {
    try {
        const { sessionId } = req.params
        const { phone, name, pointsToUse = 0 } = req.body

        if (!phone || !name) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin số điện thoại hoặc tên khách hàng',
            })
        }

        const result = await sessionService.checkoutSession(
            sessionId,
            phone,
            name,
            pointsToUse
        )

        const io = req.app.locals.io
        if (io) {
            // Broadcast session:completed tới bàn
            io.to(result.session.tableName).emit('session:completed', {
                sessionId: result.session._id,
                pointsUsed: result.pointsUsed,
                pointsDiscount: result.pointsDiscount,
                finalPrice: result.finalPrice,
                pointsEarned: result.pointsEarned,
                totalPoints: result.totalPoints,
            })

            // Broadcast tới admin
            io.emit('session:statusChanged', {
                session: result.session,
            })
        }

        // Tạo message động
        let message = 'Thanh toán thành công'
        if (result.pointsUsed > 0) {
            message += `, sử dụng ${result.pointsUsed} điểm (-${result.pointsDiscount.toLocaleString()} VNĐ)`
        }
        if (result.pointsEarned > 0) {
            message += `, tích ${result.pointsEarned} điểm`
        }

        return res.status(200).json({
            success: true,
            message,
            data: {
                session: result.session,
                payment: {
                    totalPrice: result.session.totalAmount,
                    pointsUsed: result.pointsUsed,
                    pointsDiscount: result.pointsDiscount,
                    finalPrice: result.finalPrice,
                    pointsEarned: result.pointsEarned,
                    totalPoints: result.totalPoints,
                    pointsChange: result.pointsChange,
                },
            },
        })
    } catch (error) {
        console.error('[orderController] checkoutSession error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi thanh toán session',
        })
    }
}

export const getPaymentPreview = async (req, res) => {
    try {
        const { orderId } = req.params
        const { phone, pointsToUse = 0 } = req.query

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin số điện thoại',
            })
        }

        const order = await orderService.getOrderById(orderId)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order không tồn tại',
            })
        }

        // Lấy thông tin user
        const user = await findUserByPhone(phone)

        if (!user) {
            return res.status(200).json({
                success: true,
                message:
                    'Số điện thoại chưa đăng ký, sẽ tạo tài khoản mới khi thanh toán',
                data: {
                    preview: {
                        totalPrice: order.totalPrice,
                        pointsUsed: 0,
                        pointsDiscount: 0,
                        finalPrice: order.totalPrice,
                        pointsEarned: Math.floor(order.totalPrice / 10000),
                        totalPoints: Math.floor(order.totalPrice / 10000),
                        pointsChange: Math.floor(order.totalPrice / 10000),
                    },
                    suggestions: {
                        maxPoints: 0,
                        roundPricePoints: 0,
                    },
                },
            })
        }

        const preview = calculatePaymentPreview(
            order.totalPrice,
            user.points,
            parseInt(pointsToUse)
        )

        const maxPoints = getMaxUsablePoints(order.totalPrice, user.points)
        const roundPricePoints = getPointsForRoundPrice(
            order.totalPrice,
            user.points
        )

        return res.status(200).json({
            success: true,
            data: {
                preview,
                currentPoints: user.points,
                suggestions: {
                    maxPoints,
                    roundPricePoints,
                },
            },
        })
    } catch (error) {
        console.error('[orderController] getPaymentPreview error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tính toán preview',
        })
    }
}

export const markOrderAsPaid = async (req, res) => {
    try {
        const { orderId } = req.params
        const { phone, name, pointsToUse = 0 } = req.body

        if (!phone || !name) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin số điện thoại hoặc tên khách hàng',
            })
        }

        const {
            order,
            pointsUsed,
            pointsDiscount,
            finalPrice,
            pointsEarned,
            totalPoints,
            pointsChange,
        } = await orderService.updateOrderToPaid(
            orderId,
            phone,
            name,
            pointsToUse
        )

        const io = req.app.locals.io
        if (io) {
            io.to(order.tableName).emit('order:paid', {
                orderId: order._id,
                orderNumber: order.orderNumber,
                pointsUsed,
                pointsDiscount,
                finalPrice,
                pointsEarned,
                totalPoints,
            })

            io.emit('order:statusChanged', {
                order,
            })
        }

        // Tạo message động dựa trên việc dùng điểm
        let message = 'Đã thanh toán thành công'
        if (pointsUsed > 0) {
            message += `, sử dụng ${pointsUsed} điểm (-${pointsDiscount.toLocaleString()} VNĐ)`
        }
        if (pointsEarned > 0) {
            message += `, tích ${pointsEarned} điểm`
        }

        return res.status(200).json({
            success: true,
            message,
            data: {
                order,
                payment: {
                    totalPrice: order.totalPrice,
                    pointsUsed,
                    pointsDiscount,
                    finalPrice,
                    pointsEarned,
                    totalPoints,
                    pointsChange,
                },
            },
        })
    } catch (error) {
        console.error('[orderController] markOrderAsPaid error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi thanh toán order',
        })
    }
}
