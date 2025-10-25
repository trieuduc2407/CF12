import express from 'express'

import * as staffController from '../../controllers/admin/staffController.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'

const router = express.Router()

router.use(staffAuthMiddleware)
router.post(
    '/add',
    requireRoleMiddleware('staff', 'admin'),
    staffController.addStaff
)
router.get(
    '/get/:id',
    requireRoleMiddleware('staff', 'admin'),
    staffController.getStaffById
)
router.get(
    '/all',
    requireRoleMiddleware('staff', 'admin'),
    staffController.getAllStaff
)
router.put(
    '/update/:id',
    requireRoleMiddleware('admin'),
    staffController.updateStaff
)
router.delete(
    '/delete/:id',
    requireRoleMiddleware('staff', 'admin'),
    staffController.deleteStaff
)

export { router }
