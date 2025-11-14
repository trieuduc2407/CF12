import express from 'express'

import * as statisticsController from '../../controllers/admin/statisticsController.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'

const router = express.Router()

router.use(staffAuthMiddleware)

router.get('/overview', statisticsController.getOverview)
router.get('/revenue', statisticsController.getRevenue)
router.get('/top-products', statisticsController.getTopProducts)

export default router
