import { cartModel } from '../../models/cartModel.js'
import { orderModel } from '../../models/orderModel.js'
import { productModel } from '../../models/productModel.js'
import { sessionModel } from '../../models/sessionModel.js'
import { storageModel } from '../../models/storageModel.js'
import * as sessionService from './sessionService.js'

export const createOrderFromCart = async (
    tableName,
    userId = null,
    notes = ''
) => {
    try {
        const cart = await cartModel.findOne({
            tableName,
            status: 'active',
        })

        if (!cart || cart.items.length === 0) {
            throw new Error('Giỏ hàng trống')
        }

        let session = await sessionService.getActiveSession(tableName)
        if (!session) {
            session = await sessionService.createSession(tableName)
        }

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
                price: item.subTotal / item.quantity, 
                subTotal: item.subTotal,
            })),
            totalPrice: cart.totalPrice,
            status: 'pending',
            notes,
        })

        await newOrder.save()

        const storageWarnings = []
        for (const item of cart.items) {
            const product = await productModel.findById(item.productId)
            if (product && product.ingredients) {
                for (const ingredient of product.ingredients) {
                    const storage = await storageModel.findByIdAndUpdate(
                        ingredient.ingredientId,
                        {
                            $inc: {
                                quantity: -ingredient.quantity * item.quantity,
                            },
                        },
                        { new: true }
                    )

                    if (storage && storage.quantity <= storage.threshold) {
                        storageWarnings.push({
                            ingredient: storage,
                            message: `Nguyên liệu "${storage.name}" sắp hết (${storage.quantity} ${storage.unit})`,
                        })
                    }
                }
            }
        }

        await sessionService.addOrderToSession(session._id, newOrder._id)

        cart.items = []
        cart.totalPrice = 0
        cart.version += 1
        await cart.save()

        return { order: newOrder, storageWarnings }
    } catch (error) {
        throw error
    }
}

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

export const cancelOrder = async (orderId) => {
    try {
        const order = await orderModel.findById(orderId)

        if (!order) {
            throw new Error('Order không tồn tại')
        }

        if (order.status !== 'pending') {
            throw new Error('Chỉ có thể hủy order đang chờ xử lý')
        }

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
