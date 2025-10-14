import express from "express"
import { staffAuthMiddleware } from "../../middleware/staffAuthMiddleware.js"
import { requireRoleMiddleware } from "../../middleware/requireRoleMiddleware.js"
import * as staffController from "../../controllers/admin/staffController.js"

const router = express.Router()

router.post('/add', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), staffController.addStaff)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), staffController.getStaffById)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), staffController.getAllStaff)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), staffController.updateStaff)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), staffController.deleteStaff)

export { router }