import express from 'express'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { addProduct, deleteProduct, fetchAllProduct, getProduct, updateProduct } from '../../controllers/admin/productController.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/add', staffAuthMiddleware, requireRoleMiddleware('admin'), upload.single('image'), addProduct)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware('admin'), fetchAllProduct)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), getProduct)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), updateProduct)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), deleteProduct)

export { router }
