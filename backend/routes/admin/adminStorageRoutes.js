import express from 'express'
import { addIngredient, deleteIngredient, fetchAllIngredient, getIngredient, updateIngredient } from '../../controller/admin/ingredientController.js'

const router = express.Router()

router.post('/add', addIngredient)
router.post('/get/:id', getIngredient)
router.get('/all', fetchAllIngredient)
router.put('/update/:id', updateIngredient)
router.delete('/delete/:id', deleteIngredient)

export { router }