import express from "express"
import { staffAuthMiddleware } from "../../middleware/staffAuthMiddleware.js"
import { addStaff, deleteStaff, fetchAllStaff, getStaff, updateStaff } from "../../controllers/admin/staffController.js"
import { requireRoleMiddleware } from "../../middleware/requireRoleMiddleware.js"

const router = express.Router()

router.post('/add', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), addStaff)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), getStaff)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), fetchAllStaff)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), updateStaff)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), deleteStaff)

export { router }