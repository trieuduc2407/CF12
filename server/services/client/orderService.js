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

        console.log(
            `[orderService] Bắt đầu hủy order ${orderId}, hoàn trả nguyên liệu`
        )

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

                    const storage = await storageModel.findByIdAndUpdate(
                        ingredient.ingredientId,
                        {
                            $inc: {
                                quantity: returnAmount,
                            },
                        },
                        { new: true }
                    )

                    console.log(
                        `[orderService] Hoàn trả ${returnAmount} ${storage?.unit || ''} của nguyên liệu ${storage?.name || ingredient.ingredientId}`
                    )
                }
            }
        }

        // Cập nhật trạng thái order
        order.status = 'cancelled'
        await order.save()

        // Cập nhật tổng tiền session
        const session = await sessionModel.findById(order.sessionId)
        if (session) {
            session.totalAmount -= order.totalPrice
            await session.save()
            console.log(
                `[orderService] Đã trừ ${order.totalPrice}đ khỏi session ${session._id}`
            )
        }

        // Kiểm tra xem tất cả orders trong session có bị hủy không
        const allOrdersInSession = await orderModel.find({
            sessionId: order.sessionId,
        })

        const allCancelled = allOrdersInSession.every(
            (o) => o.status === 'cancelled'
        )

        if (allCancelled && session) {
            console.log(
                `[orderService] Tất cả orders đã bị hủy, đóng session ${session._id}`
            )

            // Đóng session với status 'cancelled'
            session.status = 'cancelled'
            session.endTime = new Date()
            await session.save()

            // Reset bàn về available
            const table = await tableModel.findOne({
                tableName: order.tableName,
            })
            if (table) {
                table.status = 'available'
                table.currentSessionId = null
                table.activeCartId = null
                await table.save()
                console.log(
                    `[orderService] Đã reset bàn ${order.tableName} về available`
                )
            }
        }

        console.log(`[orderService] Đã hủy order ${orderId} thành công`)

        return order
    } catch (error) {
        console.error('[orderService] Lỗi khi hủy order:', error)
        throw error
    }
}
