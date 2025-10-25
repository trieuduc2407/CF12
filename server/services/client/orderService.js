import { cartModel } from '../../models/cartModel.js'
import { orderModel } from '../../models/orderModel.js'
import { productModel } from '../../models/productModel.js'
import { sessionModel } from '../../models/sessionModel.js'
import { storageModel } from '../../models/storageModel.js'
import * as sessionService from './sessionService.js'

/**
 * Tạo order từ cart hiện tại
 */
export const createOrderFromCart = async (
    tableName,
    userId = null,
    notes = ''
) => {
    try {
        // 1. Lấy cart hiện tại của bàn
        const cart = await cartModel.findOne({
            tableName,
            status: 'active',
        })

        if (!cart || cart.items.length === 0) {
            throw new Error('Giỏ hàng trống')
        }

        // 2. Kiểm tra hoặc tạo session cho bàn
        let session = await sessionService.getActiveSession(tableName)
        if (!session) {
            session = await sessionService.createSession(tableName)
        }

        // 3. Tạo order từ cart
        const newOrder = new orderModel({
            sessionId: session._id,
            tableName,
            userId,
            items: cart.items.map((item) => ({
                itemId: item.itemId,
                productId: item.productId,
                productName: item.productName,
                productImage: item.productImage,
                selectedSize: item.selectedSize,
                selectedTemperature: item.selectedTemperature,
                quantity: item.quantity,
                price: item.subTotal / item.quantity, // Price per item
                subTotal: item.subTotal,
            })),
            totalPrice: cart.totalPrice,
            status: 'pending',
            notes,
        })

        await newOrder.save()

        // 4. Trừ nguyên liệu trong storage
        for (const item of cart.items) {
            const product = await productModel.findById(item.productId)
            if (product && product.ingredients) {
                for (const ingredient of product.ingredients) {
                    await storageModel.findByIdAndUpdate(
                        ingredient.ingredientId,
                        {
                            $inc: {
                                quantity: -ingredient.quantity * item.quantity,
                            },
                        }
                    )
                }
            }
        }

        // 5. Thêm order vào session
        await sessionService.addOrderToSession(session._id, newOrder._id)

        // 6. Clear cart (tạo cart mới hoặc reset items)
        cart.items = []
        cart.totalPrice = 0
        cart.version += 1
        await cart.save()

        return newOrder
    } catch (error) {
        throw error
    }
}

/**
 * Lấy tất cả orders của 1 session (cho client xem history)
 */
export const getOrdersBySession = async (sessionId) => {
    try {
        const orders = await orderModel
            .find({ sessionId })
            .sort({ createdAt: -1 })

        return orders
    } catch (error) {
        throw error
    }
}

/**
 * Lấy tất cả orders của 1 bàn (dựa vào session active)
 */
export const getOrdersByTable = async (tableName) => {
    try {
        const session = await sessionService.getActiveSession(tableName)

        if (!session) {
            return []
        }

        const orders = await orderModel
            .find({ sessionId: session._id })
            .sort({ createdAt: -1 })

        return orders
    } catch (error) {
        throw error
    }
}

/**
 * Cập nhật trạng thái order (dành cho admin/staff)
 */
export const updateOrderStatus = async (orderId, status, staffId = null) => {
    try {
        const validStatuses = [
            'pending',
            'preparing',
            'ready',
            'served',
            'cancelled',
        ]

        if (!validStatuses.includes(status)) {
            throw new Error('Trạng thái không hợp lệ')
        }

        const order = await orderModel.findById(orderId)

        if (!order) {
            throw new Error('Order không tồn tại')
        }

        order.status = status
        if (staffId) {
            order.staffId = staffId
        }

        await order.save()

        return order
    } catch (error) {
        throw error
    }
}

/**
 * Lấy chi tiết 1 order
 */
export const getOrderById = async (orderId) => {
    try {
        const order = await orderModel
            .findById(orderId)
            .populate('sessionId')
            .populate('staffId')

        if (!order) {
            throw new Error('Order không tồn tại')
        }

        return order
    } catch (error) {
        throw error
    }
}

/**
 * Lấy tất cả orders (cho admin)
 */
export const getAllOrders = async (filters = {}) => {
    try {
        const { status, tableName, startDate, endDate, sessionId } = filters

        const query = {}

        if (status) {
            query.status = status
        }

        if (tableName) {
            query.tableName = tableName
        }

        if (sessionId) {
            query.sessionId = sessionId
        }

        if (startDate || endDate) {
            query.createdAt = {}
            if (startDate) {
                query.createdAt.$gte = new Date(startDate)
            }
            if (endDate) {
                query.createdAt.$lte = new Date(endDate)
            }
        }

        const orders = await orderModel
            .find(query)
            .populate('sessionId')
            .populate('staffId')
            .sort({ createdAt: -1 })

        return orders
    } catch (error) {
        throw error
    }
}

/**
 * Hủy order (chỉ khi status = pending)
 */
export const cancelOrder = async (orderId) => {
    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            throw new Error('Order không tồn tại')
        }

        if (order.status !== 'pending') {
            throw new Error('Chỉ có thể hủy order đang chờ xử lý')
        }

        // Hoàn trả nguyên liệu
        for (const item of order.items) {
            const product = await productModel.findById(item.productId)
            if (product && product.ingredients) {
                for (const ingredient of product.ingredients) {
                    await storageModel.findByIdAndUpdate(
                        ingredient.ingredientId,
                        {
                            $inc: {
                                quantity: ingredient.quantity * item.quantity,
                            },
                        }
                    )
                }
            }
        }

        order.status = 'cancelled'
        await order.save()

        // Update session totalAmount
        const session = await sessionModel.findById(order.sessionId)
        if (session) {
            session.totalAmount -= order.totalPrice
            await session.save()
        }

        return order
    } catch (error) {
        throw error
    }
}
