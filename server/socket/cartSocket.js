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

            console.log(
                `🔒 [cartSocket] Lock request: item=${itemId}, client=${clientId}, table=${tableName}`
            )

            const result = await cartService.lockItem(
                tableName,
                clientId,
                itemId
            )

            if (tableName) {
                console.log(
                    `📤 [cartSocket] Broadcasting cart:itemLocked for ${itemId}`
                )
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

            console.log(
                `✏️ [cartSocket] Update request: item=${data.itemId || data.originalItemId}, client=${clientId}`
            )

            const updatedCart = await cartService.updateItem(
                tableName,
                clientId,
                data
            )

            console.log(
                `📦 [cartSocket] Updated cart items:`,
                JSON.stringify(
                    updatedCart.items?.map((i) => ({
                        itemId: i.itemId,
                        locked: i.locked,
                        lockedBy: i.lockedBy,
                    }))
                )
            )

            if (tableName) {
                console.log(
                    `📤 [cartSocket] Broadcasting cart:updated to table ${tableName}`
                )
                io.to(tableName).emit('cart:updated', updatedCart)

                const updatedItemId = data.itemId || data.originalItemId
                console.log(
                    `📤 [cartSocket] Broadcasting cart:itemUnlocked for ${updatedItemId}`
                )
                io.to(tableName).emit('cart:itemUnlocked', {
                    itemId: updatedItemId,
                    locked: false,
                    lockedBy: null,
                })
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

            const cart = await cartService.getActiveCartByTable(tableName)
            if (cart) {
                socket.emit('cart:updated', {
                    cart,
                    action: 'sync',
                    tableName,
                })
            }
        } catch (err) {
            console.error('cart:requestLatestData error', err)
        }
    })

    socket.on('cart:deleteItem', async (payload) => {
        try {
            if (!payload || typeof payload !== 'object') return
            const { tableName, clientId, itemId } = payload

            const cart = await cartService.getActiveCartByTable(tableName)
            const item = cart?.items?.find((i) => i.itemId === itemId)

            if (!item) {
                socket.emit('cart:deleteError', {
                    itemId,
                    message: 'Sản phẩm không tồn tại trong giỏ hàng',
                })
                return
            }

            if (!item.locked) {
                await cartService.lockItem(tableName, clientId, itemId)
                io.to(tableName).emit('cart:itemLocked', {
                    itemId,
                    locked: true,
                    lockedBy: clientId,
                })
            } else if (item.lockedBy !== clientId) {
                socket.emit('cart:deleteError', {
                    itemId,
                    message: 'Sản phẩm đang được người khác chỉnh sửa',
                })
                return
            }

            const updatedCart = await cartService.deleteItem(
                tableName,
                clientId,
                itemId
            )

            if (tableName) {
                io.to(tableName).emit('cart:updated', {
                    cart: updatedCart,
                    action: 'delete',
                    tableName,
                })
            }
        } catch (err) {
            console.error('cart:deleteItem error', err)
            socket.emit('cart:deleteError', {
                itemId: payload.itemId,
                message: err.message,
            })
        }
    })
}
