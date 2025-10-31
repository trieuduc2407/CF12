// ===== IMPORTS =====
import { calculateMaxQuantity } from '../../helpers/admin/checkProductAvailability.js'
import { productModel } from '../../models/productModel.js'
import * as orderService from '../../services/client/orderService.js'

// ===== READ (GET) OPERATIONS =====
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params

        const order = await orderService.getOrderById(orderId)

        return res.status(200).json({
            success: true,
            data: order,
        })
    } catch (error) {
        console.error('[orderController] error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy chi tiết order',
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
        console.error('[orderController] error:', error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy danh sách orders',
        })
    }
}

// ===== CREATE OPERATIONS =====
export const createOrder = async (req, res) => {
    try {
        const { tableName, notes } = req.body
        if (!tableName) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bàn',
            })
        }

        const { order, storageWarnings, affectedProducts } =
            await orderService.createOrderFromCart(tableName, notes || '')

        const io = req.app.locals.io
        if (io) {
            // Emit affected products availability changes
            if (affectedProducts && affectedProducts.length > 0) {
                for (const productId of affectedProducts) {
                    const product = await productModel.findById(productId)
                    const maxQuantity = await calculateMaxQuantity(productId)

                    io.emit('product:availability-changed', {
                        productId: product._id,
                        productName: product.name,
                        available: product.available,
                        maxQuantity,
                    })
                }
            }

            // Emit order created
            io.emit('order:new', {
                order,
                tableName,
            })

            io.to(tableName).emit('order:created', {
                order,
            })

            // Emit storage warnings
            if (storageWarnings && storageWarnings.length > 0) {
                storageWarnings.forEach((warning) => {
                    io.emit('storage:warning', warning)
                })
            }

            // Emit cart cleared
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
            storageWarnings,
        })
    } catch (error) {
        console.error('[orderController] createOrder error:', error)

        // Handle INSUFFICIENT_INGREDIENTS error
        if (error.code === 'INSUFFICIENT_INGREDIENTS') {
            return res.status(400).json({
                success: false,
                code: 'INSUFFICIENT_INGREDIENTS',
                message: error.message,
                unavailableItems: error.unavailableItems,
            })
        }

        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo order',
        })
    }
}

// ===== UPDATE OPERATIONS =====
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

