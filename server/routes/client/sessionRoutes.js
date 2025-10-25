import express from 'express'

import * as sessionController from '../../controllers/client/sessionController.js'

const router = express.Router()

router.get('/', sessionController.getActiveSession)
router.post('/create', sessionController.createSession)
router.post('/checkout', sessionController.checkoutSession)
router.get('/:sessionId', sessionController.getSessionDetails)

export { router }
