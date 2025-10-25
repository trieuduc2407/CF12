import express from 'express'
import multer from 'multer'

import * as productController from '../../controllers/admin/productController.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.use(staffAuthMiddleware)
router.use(requireRoleMiddleware('admin'))
router.post('/add', upload.single('image'), productController.addProduct)
router.get('/get/:id', productController.getProductById)
router.get('/all', productController.getAllProducts)
router.get('/search', productController.searchProduct)
router.put(
    '/update/:id',
    upload.single('image'),
    productController.updateProduct
)
router.delete('/delete/:id', productController.deleteProduct)
router.put('/signature/:id', productController.toggleSignature)

export { router }
