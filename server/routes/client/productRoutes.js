import express from 'express'

import * as productController from '../../controllers/client/productController.js'

const router = express.Router()

router.get('/all', productController.getAllProducts)
router.get('/:id', productController.getProductById)

export { router }
