import { orderModel } from '../../models/orderModel.js'
import { sessionModel } from '../../models/sessionModel.js'
import { tableModel } from '../../models/tableModel.js'

/**
 * Tạo session mới cho bàn
 */
export const createSession = async (tableName) => {
    try {
        // Check xem bàn có tồn tại không
        const table = await tableModel.findOne({ tableName })
        if (!table) {
            throw new Error('Bàn không tồn tại')
        }

        // Check xem bàn đã có session active chưa
        const existingSession = await sessionModel.findOne({
            tableName,
            status: 'active',
        })

        if (existingSession) {
            return existingSession
        }

        // Tạo session mới
        const newSession = new sessionModel({
            tableName,
            startTime: new Date(),
            status: 'active',
        })

        await newSession.save()

        // Update table với sessionId
        table.currentSessionId = newSession._id
        table.status = 'occupied'
        await table.save()

        return newSession
    } catch (error) {
        throw error
    }
}

/**
 * Lấy session hiện tại của bàn
 */
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

/**
 * Lấy chi tiết session với tất cả orders
 */
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

/**
 * Thêm order vào session
 */
export const addOrderToSession = async (sessionId, orderId) => {
    try {
        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        if (session.status !== 'active') {
            throw new Error('Session đã kết thúc')
        }

        // Thêm orderId vào session.orders
        session.orders.push(orderId)

        // Cập nhật totalAmount
        const order = await orderModel.findById(orderId)
        session.totalAmount += order.totalPrice

        await session.save()

        return session
    } catch (error) {
        throw error
    }
}

/**
 * Kết thúc session (thanh toán)
 */
export const completeSession = async (sessionId, paymentData) => {
    try {
        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        if (session.status !== 'active') {
            throw new Error('Session đã kết thúc')
        }

        // Update session
        session.status = 'completed'
        session.endTime = new Date()
        await session.save()

        // Update table status
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

/**
 * Hủy session
 */
export const cancelSession = async (sessionId) => {
    try {
        const session = await sessionModel.findById(sessionId)

        if (!session) {
            throw new Error('Session không tồn tại')
        }

        // Cancel tất cả orders trong session
        await orderModel.updateMany(
            { sessionId: session._id, status: { $ne: 'served' } },
            { status: 'cancelled' }
        )

        // Update session
        session.status = 'cancelled'
        session.endTime = new Date()
        await session.save()

        // Update table
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

/**
 * Lấy tất cả sessions (cho admin)
 */
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
