import express from 'express'

import * as orderController from '../../controllers/admin/orderController.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'

const router = express.Router()

router.use(staffAuthMiddleware)
router.get('/orders', orderController.getAllOrders)
router.get('/orders/:orderId', orderController.getOrderById)
router.patch('/orders/:orderId/status', orderController.updateOrderStatus)
router.get('/sessions', orderController.getAllSessions)
router.get('/sessions/:sessionId', orderController.getSessionById)
router.patch(
    '/sessions/:sessionId/cancel',
    requireRoleMiddleware('admin'),
    orderController.cancelSession
)

export default router
