import * as cartService from '../services/client/cartService.js'

export const cartSocket = (io, socket) => {
    socket.on('cart:addItem', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return
            const {
                tableName,
                clientId,
                itemId,
                productId,
                quantity,
                size,
                temperature,
            } = payload
            const updatedCart = await cartService.addItemViaSocket({
                tableName,
                clientId,
                data: {
                    itemId,
                    productId,
                    quantity,
                    selectedSize: size,
                    selectedTemperature: temperature,
                },
            })
            if (tableName) {
                io.to(tableName).emit('cart:updated', updatedCart)
            }
        } catch (err) {
            console.error('cart:addItem error', err)
            socket.emit('error', { message: err.message })
        }
    })

    socket.on('cart:lockItem', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return
            const { tableName, clientId, itemId } = payload

            const result = await cartService.lockItem(
                tableName,
                clientId,
                itemId
            )

            if (tableName) {
                io.to(tableName).emit('cart:itemLocked', {
                    itemId,
                    locked: true,
                    lockedBy: clientId,
                })
            }
        } catch (err) {
            console.error('cart:lockItem error', err)
            socket.emit('cart:lockError', {
                itemId: payload.itemId,
                message: err.message,
            })
        }
    })

    socket.on('cart:unlockItem', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return
            const { tableName, clientId, itemId } = payload

            await cartService.unlockItem(tableName, clientId, itemId)

            if (tableName) {
                io.to(tableName).emit('cart:itemUnlocked', {
                    itemId,
                    locked: false,
                    lockedBy: null,
                })
            }
        } catch (err) {
            console.error('cart:unlockItem error', err)
            socket.emit('cart:unlockError', {
                itemId: payload.itemId,
                message: err.message,
            })
        }
    })

    socket.on('cart:updateItem', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return
            const { tableName, clientId, ...data } = payload

            const updatedCart = await cartService.updateItem(
                tableName,
                clientId,
                data
            )

            if (tableName) {
                io.to(tableName).emit('cart:updated', updatedCart)
            }
        } catch (err) {
            console.error('cart:updateItem error', err)
            socket.emit('cart:updateError', {
                itemId: payload.itemId,
                message: err.message,
            })
        }
    })

    socket.on('cart:requestLockStatus', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return
            const { tableName } = payload

            const cart = await cartService.getActiveCartByTable(tableName)
            if (cart && cart.items) {
                // Send current lock status for all items
                cart.items.forEach((item) => {
                    if (item.locked && item.lockedBy) {
                        socket.emit('cart:itemLocked', {
                            itemId: item.itemId,
                            lockedBy: item.lockedBy,
                        })
                    }
                })
            }
        } catch (err) {
            console.error('cart:requestLockStatus error', err)
        }
    })

    socket.on('cart:requestLatestData', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return
            const { tableName } = payload

            console.log(
                '🔄 Client requesting latest cart data for table:',
                tableName
            )
            const cart = await cartService.getActiveCartByTable(tableName)
            if (cart) {
                console.log('📤 Sending latest cart data to client:', socket.id)
                // Send latest cart data to ensure sync
                socket.emit('cart:updated', {
                    cart,
                    action: 'sync',
                    tableName,
                })
            } else {
                console.log('❌ No cart found for table:', tableName)
            }
        } catch (err) {
            console.error('cart:requestLatestData error', err)
        }
    })
}
