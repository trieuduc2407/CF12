import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Routes, useMatch } from 'react-router-dom'

import BaseLayout from './components/BaseLayout'
import Layout from './components/Layout'
import SessionProvider from './components/SessionProvider'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Login from './pages/Login'
import Menu from './pages/Menu'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import socket from './socket/socket'
import { lockItem, unlockItem, updateCart } from './store/client/cartSlice'
import { addOrder, updateOrder } from './store/client/orderSlice'

const SocketManager = () => {
    const currentTableRef = useRef(null)
    const clientId = localStorage.getItem('clientId')

    const tableMatch = useMatch('/tables/:tableName/*')
    const tableName = tableMatch?.params?.tableName || null

    useEffect(() => {
        const handleReconnect = () => {
            if (currentTableRef.current && clientId) {
                socket.emit('registerClient', {
                    clientId,
                    tableName: currentTableRef.current,
                })
            }
        }

        socket.on('connect', handleReconnect)

        return () => {
            socket.off('connect', handleReconnect)
        }
    }, [clientId])

    useEffect(() => {
        if (currentTableRef.current && currentTableRef.current !== tableName) {
            socket.emit('leaveTable', currentTableRef.current)
        }

        if (tableName && tableName !== currentTableRef.current) {
            currentTableRef.current = tableName

            const handleJoinConfirmation = () => {}

            const handleSocketError = (error) => {
                console.error('Socket error:', error)
            }

            socket.on('joinedTable', handleJoinConfirmation)
            socket.on('error', handleSocketError)

            if (socket.connected && clientId) {
                socket.emit('registerClient', { clientId, tableName })
            } else {
                socket.once('connect', () => {
                    if (clientId) {
                        socket.emit('registerClient', { clientId, tableName })
                    }
                })
            }

            return () => {
                socket.off('joinedTable', handleJoinConfirmation)
                socket.off('error', handleSocketError)
            }
        } else if (!tableName && currentTableRef.current) {
            socket.emit('leaveTable', currentTableRef.current)
            currentTableRef.current = null
        }
    }, [tableName, clientId])

    return null
}

const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on('cart:updated', (data) => {
            dispatch(updateCart(data))
        })

        socket.on('cart:itemLocked', ({ itemId, lockedBy }) => {
            dispatch(lockItem({ itemId, lockedBy }))
        })

        socket.on('cart:itemUnlocked', ({ itemId }) => {
            dispatch(unlockItem({ itemId }))
        })

        socket.on('cart:deleteError', ({ message }) => {
            console.error('❌ [App] Received cart:deleteError:', message)
            alert(message)
        })

        socket.on('order:created', ({ order }) => {
            dispatch(addOrder(order))
        })

        socket.on('order:updated', ({ order }) => {
            dispatch(updateOrder(order))
            if (order.status === 'ready') {
                alert(`Món của bạn đã sẵn sàng! (${order.items.length} món)`)
            }
        })

        socket.on('order:cancelSuccess', () => {
            alert('Đã hủy order thành công')
        })

        socket.on('order:cancelError', ({ message }) => {
            alert(message)
        })

        return () => {
            socket.off('cart:updated')
            socket.off('cart:itemLocked')
            socket.off('cart:itemUnlocked')
            socket.off('cart:deleteError')
            socket.off('order:created')
            socket.off('order:updated')
            socket.off('order:cancelSuccess')
            socket.off('order:cancelError')
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

                <Route path="/tables/:tableName" element={<BaseLayout />}>
                    <Route path="login" element={<Login />} />
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
