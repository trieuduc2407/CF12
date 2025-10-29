import express from 'express'

import * as userController from '../../controllers/userController.js'

const router = express.Router()

router.post('/find-or-create', userController.findOrCreateUser)

export default router
