import * as cartService from '../services/client/cartService.js'

export const cartSocket = (io, socket) => {
    // Add item via socket payload: { tableName, clientId, itemId, productId, quantity, size, temperature }
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
}
