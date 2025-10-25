import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes, useLocation } from 'react-router-dom'

import Layout from './components/Layout'
import SessionProvider from './components/SessionProvider'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Menu from './pages/Menu'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import socket from './socket/socket'
import { lockItem, unlockItem, updateCart } from './store/client/cartSlice'

const SocketManager = () => {
    const location = useLocation()

    useEffect(() => {
        // Extract tableName from URL path like /tables/T01/...
        const match = location.pathname.match(/^\/tables\/([^/]+)/)
        const tableName = match ? match[1] : null

        if (tableName) {
            console.log(
                '🔌 Attempting to join room:',
                tableName,
                'Socket connected:',
                socket.connected
            )

            const handleJoinConfirmation = (data) => {
                console.log('✅ Confirmed joined room:', data.tableName)
            }

            const handleSocketError = (error) => {
                console.error('❌ Socket error:', error)
            }

            socket.on('joinedTable', handleJoinConfirmation)
            socket.on('error', handleSocketError)

            // Join room
            if (socket.connected) {
                socket.emit('joinTable', tableName)
            } else {
                console.log('⏳ Socket not connected yet, waiting...')
                socket.once('connect', () => {
                    console.log(
                        '✅ Socket connected, now joining room:',
                        tableName
                    )
                    socket.emit('joinTable', tableName)
                })
            }

            return () => {
                socket.emit('leaveTable', tableName)
                console.log('🔌 Left socket room:', tableName)
                socket.off('joinedTable', handleJoinConfirmation)
                socket.off('error', handleSocketError)
            }
        }
    }, [location.pathname])

    return null
}

const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        // Global socket listeners for cart realtime updates
        socket.on('cart:updated', (data) => {
            dispatch(updateCart(data))
        })

        socket.on('itemLocked', ({ itemId, clientId }) => {
            dispatch(lockItem({ itemId, lockedBy: clientId }))
        })

        socket.on('itemUnlocked', ({ itemId }) => {
            dispatch(unlockItem({ itemId }))
        })

        return () => {
            socket.off('cart:updated')
            socket.off('itemLocked')
            socket.off('itemUnlocked')
        }
    }, [dispatch])

    return (
        <SessionProvider>
            <SocketManager />
            <Routes>
                <Route path="/tables/:tableName" element={<Layout />}>
                    <Route path="" element={<Home />} />
                    <Route path="menu" element={<Menu />} />
                </Route>
                <Route path="/tables/:tableName">
                    <Route path="product/:id" element={<Product />} />
                    <Route
                        path="product/:id/edit/:itemId"
                        element={<Product />}
                    />
                    <Route path="cart" element={<Cart />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </SessionProvider>
    )
}

export default App
