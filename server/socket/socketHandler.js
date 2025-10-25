import { cartSocket } from './cartSocket.js'

const connectedUsers = new Map()

export const socketHandler = (io, app) => {
    if (app) {
        app.locals.connectedUsers = connectedUsers
    }

    io.on('connection', (socket) => {
        const uuid = socket.handshake.query.uuid
        if (process.env.NODE_ENV === 'development') {
            console.log('A user connected:', socket.id, 'UUID:', uuid)
        }

        if (uuid) {
            connectedUsers.set(uuid, socket.id)
        }

        try {
            cartSocket(io, socket)
        } catch (err) {
            console.error('Failed to attach cartSocket handlers', err)
        }

        socket.on('registerClient', ({ clientId, tableName }) => {
            const oldClient = connectedUsers.get(clientId)

            if (oldClient && oldClient !== socket.id) {
                console.log(
                    `Client ${clientId} reconnected, force-disconnecting old socket ${oldClient}`
                )
                const oldSocket = io.sockets.sockets.get(oldClient)
                if (oldSocket) {
                    oldSocket.leave(tableName)
                    oldSocket.disconnect(true)
                }
            }

            connectedUsers.set(clientId, socket.id)
            socket.join(tableName)
            console.log(
                `Client ${clientId} registered and joined table ${tableName}`
            )
        })

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

        socket.on('leaveTable', (tableName) => {
            if (
                typeof tableName !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(tableName)
            ) {
                return
            }
            socket.leave(tableName)
            if (process.env.NODE_ENV === 'development') {
                console.log(`Socket ${socket.id} left table: ${tableName}`)
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
            for (const [clientId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    if (process.env.NODE_ENV === 'development') {
                        console.log('A user disconnected:', socket.id)
                    }
                    connectedUsers.delete(clientId)
                    break
                }
            }
        })
    })
}
