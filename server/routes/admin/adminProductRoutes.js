import express from 'express'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import multer from 'multer'
import * as productController from '../../controllers/admin/productController.js'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/add', staffAuthMiddleware, requireRoleMiddleware('admin'), upload.single('image'), productController.addProduct)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), productController.getProductById)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware('admin'), productController.getAllProducts)
router.get('/search', staffAuthMiddleware, requireRoleMiddleware('admin'), productController.searchProduct)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), upload.single('image'), productController.updateProduct)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), productController.deleteProduct)
router.put('/signature/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), productController.toggleSignature)

export { router }
