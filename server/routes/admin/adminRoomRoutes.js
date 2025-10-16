import express from 'express'
import * as roomController from '../../controllers/admin/roomController.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'

const router = express.Router()

router.post('/add', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), roomController.addRoom)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), roomController.getAllRooms)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), roomController.getRoomById)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), roomController.updateRoom)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), roomController.deleteRoom)
router.put('/update-active-cart/:tableId', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), roomController.updateActiveCartId)

export { router }