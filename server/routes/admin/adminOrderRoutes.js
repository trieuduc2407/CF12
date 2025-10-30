import express from 'express'

import * as orderController from '../../controllers/admin/orderController.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'

const router = express.Router()

router.use(staffAuthMiddleware)
router.get('/orders', orderController.getAllOrders)
router.get('/orders/:orderId', orderController.getOrderById)
router.get(
    '/orders/:orderId/payment-preview',
    orderController.getPaymentPreview
)
router.patch('/orders/:orderId/status', orderController.updateOrderStatus)
router.patch('/orders/:orderId/paid', orderController.markOrderAsPaid)
router.get('/sessions', orderController.getAllSessions)
router.get('/sessions/:sessionId', orderController.getSessionById)
router.get(
    '/sessions/:sessionId/payment-preview',
    orderController.getSessionPaymentPreview
)
router.patch('/sessions/:sessionId/checkout', orderController.checkoutSession)
router.patch(
    '/sessions/:sessionId/cancel',
    requireRoleMiddleware('admin'),
    orderController.cancelSession
)

export default router
