import express from 'express'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import * as storageController from '../../controllers/admin/storageController.js'

const router = express.Router()

router.post('/add', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), storageController.addIngredient)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), storageController.getIngredientById)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), storageController.getAllIngredients)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), storageController.updateIngredient)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), storageController.deleteIngredient)
router.get('/search', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), storageController.searchIngredient)

export { router }