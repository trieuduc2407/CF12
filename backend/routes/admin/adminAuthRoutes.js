import express from "express"
import { loginStaff, logoutStaff, me } from "../../controller/auth/adminAuthController.js"
import { staffAuthMiddleware } from "../../middleware/staffAuthMiddleware.js"

const router = express.Router()

router.post('/login', loginStaff)
router.post('/logout', logoutStaff)
router.get('/me', staffAuthMiddleware, me)

export { router }