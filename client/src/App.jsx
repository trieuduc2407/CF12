import React, { useEffect, useRef } from 'react'
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
    const currentTableRef = useRef(null)

    useEffect(() => {
        // Handle socket reconnection - rejoin room if needed
        const handleReconnect = () => {
            if (currentTableRef.current) {
                socket.emit('joinTable', currentTableRef.current)
            }
        }

        socket.on('connect', handleReconnect)

        return () => {
            socket.off('connect', handleReconnect)
        }
    }, [])

    useEffect(() => {
        // Extract tableName from URL path like /tables/T01/...
        const match = location.pathname.match(/^\/tables\/([^/]+)/)
        const tableName = match ? match[1] : null

        // If changing tables, leave old table first
        if (currentTableRef.current && currentTableRef.current !== tableName) {
            socket.emit('leaveTable', currentTableRef.current)
        }

        if (tableName && tableName !== currentTableRef.current) {
            currentTableRef.current = tableName

            const handleJoinConfirmation = () => {
                // Room joined successfully
            }

            const handleSocketError = (error) => {
                console.error('Socket error:', error)
            }

            socket.on('joinedTable', handleJoinConfirmation)
            socket.on('error', handleSocketError)

            // Join room
            if (socket.connected) {
                socket.emit('joinTable', tableName)
            } else {
                socket.once('connect', () => {
                    socket.emit('joinTable', tableName)
                })
            }

            return () => {
                socket.off('joinedTable', handleJoinConfirmation)
                socket.off('error', handleSocketError)
            }
        } else if (!tableName && currentTableRef.current) {
            // User left table area completely
            socket.emit('leaveTable', currentTableRef.current)
            currentTableRef.current = null
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

        socket.on('cart:itemLocked', ({ itemId, lockedBy }) => {
            dispatch(lockItem({ itemId, lockedBy }))
        })

        socket.on('cart:itemUnlocked', ({ itemId }) => {
            dispatch(unlockItem({ itemId }))
        })

        return () => {
            socket.off('cart:updated')
            socket.off('cart:itemLocked')
            socket.off('cart:itemUnlocked')
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
