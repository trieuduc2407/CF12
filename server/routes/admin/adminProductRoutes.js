import express from 'express'
import { staffAuthMiddleware } from '../../middleware/staffAuthMiddleware.js'
import { requireRoleMiddleware } from '../../middleware/requireRoleMiddleware.js'
import { addProduct, deleteProduct, getAllProduct, getProduct, updateProduct, toggleSignature, searchProduct } from '../../controllers/admin/productController.js'
import multer from 'multer'

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post('/add', staffAuthMiddleware, requireRoleMiddleware('admin'), upload.single('image'), addProduct)
router.get('/get/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), getProduct)
router.get('/all', staffAuthMiddleware, requireRoleMiddleware('admin'), getAllProduct)
router.get('/search', staffAuthMiddleware, requireRoleMiddleware('admin'), searchProduct)
router.put('/update/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), upload.single('image'), updateProduct)
router.delete('/delete/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), deleteProduct)
router.put('/signature/:id', staffAuthMiddleware, requireRoleMiddleware('admin'), toggleSignature)

export { router }
