import * as orderService from '../../services/client/orderService.js'

/**
 * POST /api/client/orders/create
 * Tạo order từ cart hiện tại
 */
export const createOrder = async (req, res) => {
    try {
        const { tableName, userId, notes } = req.body

        if (!tableName) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bàn',
            })
        }

        const { order, storageWarnings } =
            await orderService.createOrderFromCart(
                tableName,
                userId || null,
                notes || ''
            )

        const io = req.app.locals.io
        if (io) {
            io.emit('order:new', {
                order,
                tableName,
            })
        }

        if (io) {
            io.to(tableName).emit('order:created', {
                order,
            })
        }

        if (io && storageWarnings && storageWarnings.length > 0) {
            storageWarnings.forEach((warning) => {
                io.emit('storage:warning', warning)
            })
        }

        return res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu gọi món thành công',
            data: order,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo order',
        })
    }
}

/**
 * GET /api/client/orders?tableName=A01
 * Lấy tất cả orders của bàn (trong session active)
 */
export const getOrdersByTable = async (req, res) => {
    try {
        const { tableName } = req.query

        if (!tableName) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bàn',
            })
        }

        const orders = await orderService.getOrdersByTable(tableName)

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
 * GET /api/client/orders/:orderId
 * Lấy chi tiết 1 order
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
 * PATCH /api/client/orders/:orderId/cancel
 * Hủy order (chỉ khi status = pending)
 */
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params

        const order = await orderService.cancelOrder(orderId)

        return res.status(200).json({
            success: true,
            message: 'Hủy order thành công',
            data: order,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi hủy order',
        })
    }
}
