import express from "express"
import { changePassword, loginStaff, logoutStaff, me } from "../../controllers/auth/adminAuthController.js"
import { staffAuthMiddleware } from "../../middleware/staffAuthMiddleware.js"

const router = express.Router()

router.post('/login', loginStaff)
router.post('/logout', logoutStaff)
router.get('/me', staffAuthMiddleware, me)
router.put('/change-password/:id', staffAuthMiddleware, changePassword)

export { router }