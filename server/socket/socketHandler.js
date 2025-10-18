export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('A user connected:', socket.id)
        }

        socket.on('joinTable', (tableName) => {
            if (
                typeof tableName !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(tableName)
            ) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `Invalid tableName received from socket ${socket.id}:`,
                        tableName
                    )
                }
                socket.emit('error', { message: 'Invalid table name.' })
                return
            }
            socket.join(tableName)
            if (process.env.NODE_ENV === 'development') {
                console.log(`Socket ${socket.id} joined table: ${tableName}`)
            }
        })

        socket.on('lockItem', ({ tableName, itemId, clientId }) => {
            if (
                typeof tableName !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(tableName) ||
                typeof itemId !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(itemId) ||
                typeof clientId !== 'string' ||
                !clientId.trim()
            ) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(`Invalid lockItem payload from ${socket.id}:`, {
                        tableName,
                        itemId,
                        clientId,
                    })
                }
                socket.emit('error', {
                    message: 'Invalid lockItem parameters.',
                })
                return
            }
            socket.to(tableName).emit('itemLocked', { itemId, clientId })
        })

        socket.on('unlockItem', ({ tableName, itemId }) => {
            if (
                typeof tableName !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(tableName) ||
                typeof itemId !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(itemId)
            ) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `Invalid unlockItem params from socket ${socket.id}:`,
                        { tableName, itemId }
                    )
                }
                socket.emit('error', {
                    message: 'Invalid unlockItem parameters.',
                })
                return
            }
            socket.to(tableName).emit('itemUnlocked', { itemId })
        })

        socket.on('updateCart', ({ tableName, cart }) => {
            if (
                typeof tableName !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(tableName)
            ) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `Invalid tableName in updateCart from ${socket.id}:`,
                        tableName
                    )
                }
                socket.emit('error', { message: 'Invalid table name.' })
                return
            }
            if (
                typeof cart !== 'object' ||
                cart === null ||
                !Array.isArray(cart.items) ||
                typeof cart.cartVersion !== 'number' ||
                typeof cart.clients !== 'object' ||
                cart.items.some(
                    (item) =>
                        typeof item !== 'object' ||
                        typeof item.id !== 'string' ||
                        typeof item.name !== 'string' ||
                        typeof item.quantity !== 'number'
                )
            ) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(
                        `Invalid cart payload in updateCart from ${socket.id}:`,
                        cart
                    )
                }
                socket.emit('error', { message: 'Invalid cart data.' })
                return
            }
            socket.to(tableName).emit('cartUpdated', { cart })
        })

        socket.on('disconnect', () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('A user disconnected:', socket.id)
            }
        })
    })
}
