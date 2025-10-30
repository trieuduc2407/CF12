import * as orderService from '../../services/client/orderService.js'

export const createOrder = async (req, res) => {
    try {
        const { tableName, notes } = req.body
        if (!tableName) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bàn',
            })
        }

        const { order, storageWarnings } =
            await orderService.createOrderFromCart(tableName, notes || '')
        const io = req.app.locals.io
        if (io) {
            io.emit('order:new', {
                order,
                tableName,
            })

            io.to(tableName).emit('order:created', {
                order,
            })

            if (storageWarnings && storageWarnings.length > 0) {
                storageWarnings.forEach((warning) => {
                    io.emit('storage:warning', warning)
                })
            }

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
        console.error('[orderController] createOrder error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo order',
        })
    }
}

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

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params
        const order = await orderService.cancelOrder(orderId)
        const io = req.app.locals.io
        if (io) {
            io.emit('order:cancelled', {
                order,
            })

            if (order.tableName) {
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
        console.error('[orderController] cancelOrder error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi hủy order',
        })
    }
}
