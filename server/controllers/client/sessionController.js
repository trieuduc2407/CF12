import * as sessionService from '../../services/client/sessionService.js'

/**
 * GET /api/client/session?tableName=A01
 * Lấy session hiện tại của bàn
 */
export const getActiveSession = async (req, res) => {
    try {
        const { tableName } = req.query

        if (!tableName) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bàn',
            })
        }

        const session = await sessionService.getActiveSession(tableName)

        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Không có session đang hoạt động',
            })
        }

        return res.status(200).json({
            success: true,
            data: session,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy session',
        })
    }
}

/**
 * POST /api/client/session/create
 * Tạo session mới cho bàn
 */
export const createSession = async (req, res) => {
    try {
        const { tableName } = req.body

        if (!tableName) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bàn',
            })
        }

        const session = await sessionService.createSession(tableName)

        return res.status(201).json({
            success: true,
            message: 'Tạo session thành công',
            data: session,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi tạo session',
        })
    }
}

/**
 * POST /api/client/session/checkout
 * Thanh toán và kết thúc session
 */
export const checkoutSession = async (req, res) => {
    try {
        const { sessionId, paymentData } = req.body

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin session',
            })
        }

        const session = await sessionService.completeSession(
            sessionId,
            paymentData || {}
        )

        return res.status(200).json({
            success: true,
            message: 'Thanh toán thành công',
            data: session,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi thanh toán',
        })
    }
}

/**
 * GET /api/client/session/:sessionId
 * Lấy chi tiết session với tất cả orders
 */
export const getSessionDetails = async (req, res) => {
    try {
        const { sessionId } = req.params

        const session = await sessionService.getSessionDetails(sessionId)

        return res.status(200).json({
            success: true,
            data: session,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi lấy chi tiết session',
        })
    }
}
