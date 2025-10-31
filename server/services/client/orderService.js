import {
    calculateMaxQuantity,
    updateProductAvailability,
} from '../../helpers/admin/checkProductAvailability.js'
import { cartModel } from '../../models/cartModel.js'
import { orderModel } from '../../models/orderModel.js'
import { productModel } from '../../models/productModel.js'
import { sessionModel } from '../../models/sessionModel.js'
import { storageModel } from '../../models/storageModel.js'
import { tableModel } from '../../models/tableModel.js'
import * as sessionService from './sessionService.js'
import { findOrCreateUser } from './userService.js'

export const createOrderFromCart = async (tableName, notes = '') => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) {
            throw new Error('Bàn không tồn tại')
        }

        const cart = await cartModel
            .findOne({
                tableId: table._id,
                status: 'active',
            })
            .populate('items.productId', 'name basePrice imageUrl')

        if (!cart || cart.items.length === 0) {
            throw new Error('Giỏ hàng trống')
        }

        // VALIDATE: Check maxQuantity trước khi tạo order (Prevent Overselling)
        const unavailableItems = []

        for (const item of cart.items) {
            const productId = item.productId._id || item.productId
            const maxQuantity = await calculateMaxQuantity(productId)

            if (item.quantity > maxQuantity) {
                unavailableItems.push({
                    productId: productId,
                    productName: item.productId.name || item.productName,
                    requested: item.quantity,
                    available: maxQuantity,
                })
            }
        }

        // Nếu có món không đủ nguyên liệu → REJECT toàn bộ order
        if (unavailableItems.length > 0) {
            const error = new Error('Một số món không đủ nguyên liệu')
            error.code = 'INSUFFICIENT_INGREDIENTS'
            error.unavailableItems = unavailableItems
            throw error
        }

        let session = await sessionService.getActiveSession(tableName)
        if (!session) {
            session = await sessionService.createSession(tableName)
        }

        const orderItems = cart.items.map((item) => {
            const product = item.productId
            return {
                itemId: item.itemId,
                productId: product._id,
                productName: product.name,
                productImage: product.imageUrl,
                selectedSize: item.selectedSize,
                selectedTemperature: item.selectedTemperature,
                quantity: item.quantity,
                price: item.subTotal / item.quantity,
                subTotal: item.subTotal,
            }
        })

        const newOrder = new orderModel({
            sessionId: session._id,
            tableName,
            userId: null,
            items: orderItems,
            totalPrice: cart.totalPrice,
            finalPrice: cart.totalPrice,
            status: 'pending',
            notes,
        })

        await newOrder.save()

        const storageWarnings = []
        const affectedProducts = new Set()

        for (const item of cart.items) {
            const productId = item.productId._id || item.productId
            const product = await productModel.findById(productId)

            if (
                product &&
                product.ingredients &&
                Array.isArray(product.ingredients)
            ) {
                for (const ingredient of product.ingredients) {
                    const ingredientAmount =
                        ingredient.amount || ingredient.quantity

                    if (!ingredient.ingredientId || !ingredientAmount) {
                        console.warn(
                            '[orderService] Invalid ingredient data:',
                            ingredient
                        )
                        continue
                    }

                    const decrementAmount = ingredientAmount * item.quantity

                    if (isNaN(decrementAmount)) {
                        console.error(
                            `[orderService] NaN detected: ingredientAmount=${ingredientAmount}, item.quantity=${item.quantity}`
                        )
                        continue
                    }

                    const storage = await storageModel.findByIdAndUpdate(
                        ingredient.ingredientId,
                        {
                            $inc: {
                                quantity: -decrementAmount,
                            },
                        },
                        { new: true }
                    )

                    // CHỈ UPDATE PRODUCT KHI CHẠM THRESHOLD
                    if (storage && storage.quantity <= storage.threshold) {
                        affectedProducts.add(productId.toString())

                        storageWarnings.push({
                            ingredient: storage,
                            message: `Nguyên liệu "${storage.name}" sắp hết (${storage.quantity} ${storage.unit})`,
                        })
                    }
                }
            }
        }

        // UPDATE AVAILABILITY CHO CÁC PRODUCTS BỊ ẢNH HƯỞNG
        for (const productId of affectedProducts) {
            await updateProductAvailability(productId)
        }

        await sessionService.addOrderToSession(session._id, newOrder._id)

        cart.items = []
        cart.totalPrice = 0
        cart.version += 1
        await cart.save()

        return {
            order: newOrder,
            storageWarnings,
            affectedProducts: Array.from(affectedProducts),
        }
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
            'paid',
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

        await order.populate('sessionId')

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
        const order = await orderModel.findById(orderId).populate('sessionId')

        if (!order) {
            throw new Error('Order không tồn tại')
        }

        if (order.status !== 'pending') {
            throw new Error('Chỉ có thể hủy order đang chờ xử lý')
        }

        const affectedProducts = new Set()
        const storagesAboveThreshold = new Set()

        // Hoàn trả nguyên liệu
        for (const item of order.items) {
            const product = await productModel.findById(item.productId)
            if (
                product &&
                product.ingredients &&
                Array.isArray(product.ingredients)
            ) {
                for (const ingredient of product.ingredients) {
                    // Sử dụng cả 'amount' và 'quantity' để tương thích
                    const ingredientAmount =
                        ingredient.amount || ingredient.quantity

                    if (!ingredient.ingredientId || !ingredientAmount) {
                        console.warn(
                            '[orderService] Invalid ingredient data:',
                            ingredient
                        )
                        continue
                    }

                    // Hoàn trả đúng số lượng đã trừ khi tạo order
                    const returnAmount = ingredientAmount * item.quantity

                    if (isNaN(returnAmount)) {
                        console.error(
                            `[orderService] NaN detected: ingredientAmount=${ingredientAmount}, item.quantity=${item.quantity}`
                        )
                        continue
                    }

                    const oldStorage = await storageModel.findById(
                        ingredient.ingredientId
                    )
                    const oldQuantity = oldStorage.quantity

                    const storage = await storageModel.findByIdAndUpdate(
                        ingredient.ingredientId,
                        {
                            $inc: {
                                quantity: returnAmount,
                            },
                        },
                        { new: true }
                    )

                    const newQuantity = storage.quantity

                    // CHỈ UPDATE PRODUCT KHI:
                    // 1. Vẫn dưới/bằng threshold (newQuantity <= threshold)
                    // 2. HOẶC vừa vượt qua threshold (từ dưới lên trên)
                    if (
                        newQuantity <= storage.threshold ||
                        (oldQuantity <= storage.threshold &&
                            newQuantity > storage.threshold)
                    ) {
                        affectedProducts.add(item.productId.toString())

                        if (
                            oldQuantity <= storage.threshold &&
                            newQuantity > storage.threshold
                        ) {
                            storagesAboveThreshold.add(storage._id.toString())
                        }
                    }
                }
            }
        }

        // UPDATE AVAILABILITY CHO CÁC PRODUCTS BỊ ẢNH HƯỞNG
        for (const productId of affectedProducts) {
            await updateProductAvailability(productId)
        }

        // Cập nhật trạng thái order
        order.status = 'cancelled'
        await order.save()

        // Cập nhật tổng tiền session
        const session = await sessionModel.findById(order.sessionId)
        if (session) {
            session.totalAmount -= order.totalPrice
            await session.save()
        }

        // Kiểm tra xem tất cả orders trong session có bị hủy không
        const allOrdersInSession = await orderModel.find({
            sessionId: order.sessionId,
        })

        const allCancelled = allOrdersInSession.every(
            (o) => o.status === 'cancelled'
        )

        if (allCancelled && session) {
            session.status = 'cancelled'
            session.endTime = new Date()
            await session.save()

            const table = await tableModel.findOne({
                tableName: order.tableName,
            })
            if (table) {
                table.status = 'available'
                table.currentSessionId = null
                table.activeCartId = null
                await table.save()
            }
        }

        return {
            order,
            affectedProducts: Array.from(affectedProducts),
            storagesAboveThreshold: Array.from(storagesAboveThreshold),
        }
    } catch (error) {
        console.error('[orderService] Lỗi khi hủy order:', error)
        throw error
    }
}
