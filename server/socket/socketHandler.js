import * as cartService from '../services/client/cartService.js'
import { cartSocket } from './cartSocket.js'
import { notificationSocket } from './notificationSocket.js'
import { orderSocket } from './orderSocket.js'

const connectedUsers = new Map()

export const socketHandler = (io, app) => {
    if (app) {
        app.locals.connectedUsers = connectedUsers
        app.locals.io = io
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

        try {
            orderSocket(io, socket)
        } catch (err) {
            console.error('Failed to attach orderSocket handlers', err)
        }

        try {
            notificationSocket(io)
        } catch (err) {
            console.error('Failed to attach notificationSocket handlers', err)
        }

        socket.on('registerClient', ({ clientId, tableName }) => {
            const oldClient = connectedUsers.get(clientId)

            if (oldClient && oldClient !== socket.id) {
                const oldSocket = io.sockets.sockets.get(oldClient)
                if (oldSocket) {
                    oldSocket.leave(tableName)
                    oldSocket.disconnect(true)
                }
            }

            connectedUsers.set(clientId, socket.id)
            socket.join(tableName)
        })

        socket.on('joinTable', (tableName) => {
            if (
                typeof tableName !== 'string' ||
                !/^[a-zA-Z0-9_-]+$/.test(tableName)
            ) {
                socket.emit('error', { message: 'Invalid table name.' })
                return
            }

            socket.join(tableName)
            socket.emit('joinedTable', { tableName })
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

        socket.on('disconnect', async () => {
            let disconnectedClientId = null

            for (const [clientId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedClientId = clientId
                    connectedUsers.delete(clientId)
                    if (process.env.NODE_ENV === 'development') {
                        console.log(
                            `A user disconnected: ${socket.id}, clientId: ${clientId}`
                        )
                    }
                    break
                }
            }

            if (disconnectedClientId) {
                try {
                    const unlockedItems =
                        await cartService.unlockAllItemsByClient(
                            disconnectedClientId
                        )

                    unlockedItems.forEach(({ tableName, itemId }) => {
                        if (tableName) {
                            io.to(tableName).emit('cart:itemUnlocked', {
                                itemId,
                                locked: false,
                                lockedBy: null,
                            })
                        }
                    })
                } catch (error) {
                    console.error(
                        '[socketHandler] Lỗi khi mở khóa items sau disconnect:',
                        error
                    )
                }
            }
        })
    })
}
