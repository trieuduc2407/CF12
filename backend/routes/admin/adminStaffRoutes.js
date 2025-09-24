import express from "express"
import { staffAuthMiddleware } from "../../middleware/staffAuthMiddleware.js"
import { addStaff, changePassword, deleteStaff, fetchAllStaff, getStaff, updateStaff } from "../../controller/admin/staffController.js"
import { requireRole } from "../../middleware/roleMiddleware.js"

const router = express.Router()

router.post('/add',staffAuthMiddleware,requireRole('staff','admin'),  addStaff)
router.get('/get/:id', staffAuthMiddleware, requireRole('staff', 'admin'), getStaff)
router.get('/all', staffAuthMiddleware, requireRole('staff', 'admin'), fetchAllStaff)
router.put('/update/:id', staffAuthMiddleware, requireRole('admin'), updateStaff)
router.delete('/delete/:id', staffAuthMiddleware, requireRole('staff', 'admin'), deleteStaff)
router.put('/change-password/:id', staffAuthMiddleware, changePassword)

export { router }