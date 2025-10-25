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

export const completeSession = async (sessionId, paymentData) => {
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
