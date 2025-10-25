import express from 'express'

import * as cartController from '../../controllers/client/cartController.js'

const router = express.Router()

router.get('/:tableName/get', cartController.getActiveCart)
router.post('/:tableName/add', cartController.addItem)
router.put('/:tableName/update', cartController.updateItem)
router.post('/:tableName/:itemId/lock', cartController.lockItem)
router.post('/:tableName/:itemId/unlock', cartController.unlockItem)

export { router }
