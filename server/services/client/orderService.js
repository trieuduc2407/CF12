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
                    if (!ingredient.ingredientId || !ingredient.quantity) {
                        console.warn(
                            '[orderService] Invalid ingredient data:',
                            ingredient
                        )
                        continue
                    }

                    const decrementAmount = ingredient.quantity * item.quantity

                    if (isNaN(decrementAmount)) {
                        console.error(
                            `❌ NaN detected: ingredient.quantity=${ingredient.quantity}, item.quantity=${item.quantity}`
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

export const updateOrderToPaid = async (
    orderId,
    phone,
    name,
    pointsToUse = 0
) => {
    try {
        const order = await orderModel.findById(orderId)
        if (!order) {
            throw new Error('Order không tồn tại')
        }

        if (order.status !== 'served') {
            throw new Error('Order chưa được phục vụ, không thể thanh toán')
        }

        const user = await findOrCreateUser({ phone, name })

        // Validate pointsToUse
        if (pointsToUse < 0) {
            throw new Error('Số điểm sử dụng không hợp lệ')
        }

        if (pointsToUse > user.points) {
            throw new Error(
                `User chỉ có ${user.points} điểm, không thể sử dụng ${pointsToUse} điểm`
            )
        }

        // Tính toán giảm giá từ điểm: 1 điểm = 1,000 VNĐ
        const pointsDiscount = pointsToUse * 1000

        // Đảm bảo giảm giá không vượt quá tổng tiền
        const actualDiscount = Math.min(pointsDiscount, order.totalPrice)
        const actualPointsUsed = Math.floor(actualDiscount / 1000)

        // Tính finalPrice sau khi trừ điểm
        const finalPrice = order.totalPrice - actualDiscount

        // Tính điểm tích lũy dựa trên finalPrice: 1 điểm cho mỗi 10,000 VNĐ
        const pointsEarned = Math.floor(finalPrice / 10000)

        // Cập nhật điểm cho user: trừ điểm đã dùng, cộng điểm tích lũy
        const pointsChange = pointsEarned - actualPointsUsed
        user.points += pointsChange
        await user.save()

        // Cập nhật order với thông tin thanh toán
        order.status = 'paid'
        order.userId = user._id
        order.pointsUsed = actualPointsUsed
        order.pointsDiscount = actualDiscount
        order.finalPrice = finalPrice
        order.pointsEarned = pointsEarned
        await order.save()

        console.log(
            `[orderService] Order ${orderId} đã thanh toán:
            - Total: ${order.totalPrice} VNĐ
            - Dùng: ${actualPointsUsed} điểm (-${actualDiscount} VNĐ)
            - Final: ${finalPrice} VNĐ
            - Tích: ${pointsEarned} điểm
            - User points: ${user.points - pointsChange} → ${user.points}`
        )

        return {
            order,
            pointsUsed: actualPointsUsed,
            pointsDiscount: actualDiscount,
            finalPrice,
            pointsEarned,
            totalPoints: user.points,
            pointsChange,
        }
    } catch (error) {
        console.error('[orderService] updateOrderToPaid error:', error)
        throw new Error(`Lỗi khi cập nhật order sang paid: ${error.message}`)
    }
}
