import express from 'express'

import * as tableController from '../../controllers/admin/tableController.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'

const router = express.Router()

router.use(staffAuthMiddleware)
router.use(requireRoleMiddleware('admin', 'staff'))
router.post('/add', tableController.addTable)
router.get('/all', tableController.getAllTables)
router.get('/get/:id', tableController.getTableById)
router.put('/update/:id', tableController.updateTable)
router.delete('/delete/:id', tableController.deleteTable)
router.put('/update-active-cart/:tableName', tableController.updateActiveCartId)

export { router }
