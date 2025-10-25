import express from 'express'

import * as storageController from '../../controllers/admin/storageController.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'

const router = express.Router()

router.use(staffAuthMiddleware)
router.use(requireRoleMiddleware('staff', 'admin'))
router.post('/add', storageController.addIngredient)
router.get('/get/:id', storageController.getIngredientById)
router.get('/all', storageController.getAllIngredients)
router.put('/update/:id', storageController.updateIngredient)
router.delete('/delete/:id', storageController.deleteIngredient)
router.get('/search', storageController.searchIngredient)

export { router }
