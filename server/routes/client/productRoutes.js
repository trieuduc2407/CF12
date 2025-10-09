import express from 'express'
import { getAllProduct } from '../../controllers/client/productController.js'

const router = express.Router()

router.get('/all', getAllProduct)

export { router }