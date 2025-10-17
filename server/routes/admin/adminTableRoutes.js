import express from 'express'
import * as tableController from '../../controllers/admin/tableController.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'

const router = express.Router()

router.post('/add', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), tableController.addTable)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), tableController.getAllTables)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), tableController.getTableById)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), tableController.updateTable)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), tableController.deleteTable)
router.put('/update-active-cart/:tableName', staffAuthMiddleware, requireRoleMiddleware(['admin', 'staff']), tableController.updateActiveCartId)

export { router }