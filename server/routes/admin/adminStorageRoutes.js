import express from 'express'
import { addIngredient, deleteIngredient, getAllIngredient, getIngredient, searchIngredient, updateIngredient } from '../../controllers/admin/ingredientController.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'

const router = express.Router()

router.post('/add', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), addIngredient)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), getIngredient)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), getAllIngredient)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), updateIngredient)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), deleteIngredient)
router.get('/search', staffAuthMiddleware, requireRoleMiddleware('staff', 'admin'), searchIngredient)

export { router }