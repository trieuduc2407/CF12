import express from 'express'

import * as orderController from '../../controllers/client/orderController.js'

const router = express.Router()

router.get('/', orderController.getOrdersByTable)
router.post('/create', orderController.createOrder)
router.get('/:orderId', orderController.getOrderById)
router.patch('/:orderId/cancel', orderController.cancelOrder)

export { router }
