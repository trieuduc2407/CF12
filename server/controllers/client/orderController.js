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

        console.log(
            `📝 [orderController] Creating order: table=${tableName}, user=${userId || 'guest'}`
        )

        const { order, storageWarnings } =
            await orderService.createOrderFromCart(
                tableName,
                userId || null,
                notes || ''
            )

        const io = req.app.locals.io
        if (io) {
            // Broadcast new order to admin panel
            console.log(
                `📤 [orderController] Broadcasting order:new to admin panel`
            )
            io.emit('order:new', {
                order,
                tableName,
            })

            // Broadcast order created confirmation to the table
            console.log(
                `📤 [orderController] Broadcasting order:created to table ${tableName}`
            )
            io.to(tableName).emit('order:created', {
                order,
            })

            // Broadcast storage warnings if any
            if (storageWarnings && storageWarnings.length > 0) {
                console.log(
                    `⚠️ [orderController] Broadcasting ${storageWarnings.length} storage warnings`
                )
                storageWarnings.forEach((warning) => {
                    io.emit('storage:warning', warning)
                })
            }

            // Broadcast cart cleared event to table
            console.log(
                `📤 [orderController] Broadcasting cart:cleared to table ${tableName}`
            )
            io.to(tableName).emit('cart:updated', {
                cart: {
                    items: [],
                    totalPrice: 0,
                },
                action: 'cleared',
                tableName,
            })
        }

        return res.status(201).json({
            success: true,
            message: 'Gửi yêu cầu gọi món thành công',
            data: order,
        })
    } catch (error) {
        console.error('❌ [orderController] createOrder error:', error)
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

        console.log(`🚫 [orderController] Cancelling order: ${orderId}`)

        const order = await orderService.cancelOrder(orderId)

        const io = req.app.locals.io
        if (io) {
            // Broadcast to admin panel
            console.log(
                `📤 [orderController] Broadcasting order:cancelled to admin`
            )
            io.emit('order:cancelled', {
                order,
            })

            // Broadcast to table
            if (order.tableName) {
                console.log(
                    `📤 [orderController] Broadcasting order:updated to table ${order.tableName}`
                )
                io.to(order.tableName).emit('order:updated', {
                    order,
                    tableName: order.tableName,
                })
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Hủy order thành công',
            data: order,
        })
    } catch (error) {
        console.error('❌ [orderController] cancelOrder error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi hủy order',
        })
    }
}
