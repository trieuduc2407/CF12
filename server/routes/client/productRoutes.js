import express from 'express'
import { getAllProduct, getLastestProducts } from '../../controllers/client/productController.js'

const router = express.Router()

router.get('/all', getAllProduct)
router.get('/latest', getLastestProducts)

export { router }