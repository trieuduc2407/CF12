import { orderModel } from '../../models/orderModel.js'
import { sessionModel } from '../../models/sessionModel.js'
import { tableModel } from '../../models/tableModel.js'

export const createSession = async (tableName) => {
    try {
        const table = await tableModel.findOne({ tableName })
        if (!table) {
            throw new Error('Bàn không tồn tại')
        }

        const existingSession = await sessionModel.findOne({
            tableName,
            status: 'active',
        })

        if (existingSession) {
            return existingSession
        }

        const newSession = new sessionModel({
            tableName,
            startTime: new Date(),
            status: 'active',
        })

        await newSession.save()

        table.currentSessionId = newSession._id
        table.status = 'occupied'
        await table.save()

        return newSession
    } catch (error) {
        throw error
    }
}

export const getActiveSession = async (tableName) => {
    try {
        const session = await sessionModel
            .findOne({ tableName, status: 'active' })
            .populate({
                path: 'orders',
                options: { sort: { createdAt: -1 } },
            })

        return session
    } catch (error) {
        throw error
    }
}

export const getSessionDetails = async (sessionId) => {
    try {
        const session = await sessionModel.findById(sessionId).populate({
            path: 'orders',
            options: { sort: { createdAt: -1 } },
        })

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        return session
    } catch (error) {
        throw error
    }
}

// Alias cho getSessionDetails
export const getSessionById = getSessionDetails

export const addOrderToSession = async (sessionId, orderId) => {
    try {
        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        if (session.status !== 'active') {
            throw new Error('Session đã kết thúc')
        }

        session.orders.push(orderId)

        const order = await orderModel.findById(orderId)
        session.totalAmount += order.totalPrice

        await session.save()

        return session
    } catch (error) {
        throw error
    }
}

export const getSessionPaymentPreview = async (
    sessionId,
    phone,
    pointsToUse = 0
) => {
    try {
        const { findUserByPhone } = await import('./userService.js')

        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        if (session.status !== 'active') {
            throw new Error('Session đã kết thúc')
        }

        const user = await findUserByPhone(phone)
        const totalPrice = session.totalAmount

        // User mới
        if (!user) {
            return {
                preview: {
                    totalPrice,
                    pointsUsed: 0,
                    pointsDiscount: 0,
                    finalPrice: totalPrice,
                    pointsEarned: Math.floor(totalPrice / 10000),
                    totalPoints: Math.floor(totalPrice / 10000),
                    pointsChange: Math.floor(totalPrice / 10000),
                },
                currentPoints: 0,
                userName: null, // User mới chưa có tên
                suggestions: {
                    maxPoints: 0,
                    roundPricePoints: 0,
                },
                isNewUser: true,
            }
        }

        // Import helper
        const {
            calculatePaymentPreview,
            getMaxUsablePoints,
            getPointsForRoundPrice,
        } = await import('../../helpers/client/calculatePoints.js')

        const preview = calculatePaymentPreview(
            totalPrice,
            user.points,
            pointsToUse
        )
        const maxPoints = getMaxUsablePoints(totalPrice, user.points)
        const roundPricePoints = getPointsForRoundPrice(totalPrice, user.points)

        return {
            preview,
            currentPoints: user.points,
            userName: user.name || null,
            suggestions: {
                maxPoints,
                roundPricePoints,
            },
            isNewUser: false,
        }
    } catch (error) {
        throw error
    }
}

export const checkoutSession = async (
    sessionId,
    phone,
    name,
    pointsToUse = 0
) => {
    try {
        const { findOrCreateUser } = await import('./userService.js')

        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        if (session.status !== 'active') {
            throw new Error('Session đã kết thúc')
        }

        // Tìm hoặc tạo user (name optional)
        const user = await findOrCreateUser({ phone, name })

        // Nếu name được cung cấp và khác với name hiện tại, update user
        if (name && name !== user.name) {
            user.name = name
            await user.save()
        }

        // Validate pointsToUse
        if (pointsToUse > user.points) {
            throw new Error(
                `Số điểm sử dụng (${pointsToUse}) vượt quá điểm hiện có (${user.points})`
            )
        }

        // Calculate payment
        const totalPrice = session.totalAmount
        const actualPointsUsed = Math.min(
            pointsToUse,
            Math.floor(totalPrice / 1000)
        )
        const pointsDiscount = actualPointsUsed * 1000
        const finalPrice = totalPrice - pointsDiscount
        const pointsEarned = Math.floor(finalPrice / 10000)

        // Update session
        session.userId = user._id
        session.customerName = user.name || phone // Dùng name nếu có, không thì dùng phone
        session.customerPhone = phone
        session.pointsUsed = actualPointsUsed
        session.pointsDiscount = pointsDiscount
        session.finalPrice = finalPrice
        session.pointsEarned = pointsEarned
        session.status = 'completed'
        session.endTime = new Date()
        await session.save()

        // Update user points
        const pointsChange = pointsEarned - actualPointsUsed
        user.points += pointsChange
        await user.save()

        // Update table
        const table = await tableModel.findOne({ tableName: session.tableName })
        if (table) {
            table.status = 'available'
            table.currentSessionId = null
            table.activeCartId = null
            await table.save()
        }

        // Update all orders trong session thành 'paid'
        await orderModel.updateMany(
            { sessionId: session._id },
            {
                $set: {
                    status: 'paid',
                    userId: user._id,
                },
            }
        )

        return {
            session,
            pointsUsed: actualPointsUsed,
            pointsDiscount,
            finalPrice,
            pointsEarned,
            totalPoints: user.points,
            pointsChange,
        }
    } catch (error) {
        throw error
    }
}

export const completeSession = async (sessionId) => {
    try {
        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        if (session.status !== 'active') {
            throw new Error('Session đã kết thúc')
        }

        session.status = 'completed'
        session.endTime = new Date()
        await session.save()

        const table = await tableModel.findOne({ tableName: session.tableName })
        if (table) {
            table.status = 'available'
            table.currentSessionId = null
            table.activeCartId = null
            await table.save()
        }

        return session
    } catch (error) {
        throw error
    }
}

export const cancelSession = async (sessionId) => {
    try {
        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        await orderModel.updateMany(
            { sessionId: session._id, status: { $ne: 'served' } },
            { status: 'cancelled' }
        )

        session.status = 'cancelled'
        session.endTime = new Date()
        await session.save()

        const table = await tableModel.findOne({ tableName: session.tableName })
        if (table) {
            table.status = 'available'
            table.currentSessionId = null
            table.activeCartId = null
            await table.save()
        }

        return session
    } catch (error) {
        throw error
    }
}

export const getAllSessions = async (filters = {}) => {
    try {
        const { status, tableName, startDate, endDate } = filters

        const query = {}

        if (status) {
            query.status = status
        }

        if (tableName) {
            query.tableName = tableName
        }

        if (startDate || endDate) {
            query.startTime = {}
            if (startDate) {
                query.startTime.$gte = new Date(startDate)
            }
            if (endDate) {
                query.startTime.$lte = new Date(endDate)
            }
        }

        const sessions = await sessionModel
            .find(query)
            .populate('orders')
            .sort({ startTime: -1 })

        return sessions
    } catch (error) {
        throw error
    }
}
