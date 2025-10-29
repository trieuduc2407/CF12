import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import RedirectIfAuth from './components/RedirectIfAuth'
import RequireAuth from './components/RequireAuth'
import RoleProtectedRoute from './components/RoleProtectedRoute'
import ChangePassword from './pages/ChangePassword'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Notfound from './pages/Notfound'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Room from './pages/Room'
import Staffs from './pages/Staffs'
import Storage from './pages/Storage'
import socket from './socket/socket'
import { addNewOrder, updateOrderInList } from './store/admin/orderSlice'

const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on('order:new', ({ order, tableName }) => {
            dispatch(addNewOrder(order))

            if (Notification.permission === 'granted') {
                new Notification('Đơn mới!', {
                    body: `Bàn ${tableName} - ${order.items.length} món - ${order.totalPrice.toLocaleString()}đ`,
                    icon: '/logo.png',
                })
            }
        })

        socket.on('order:statusChanged', ({ order }) => {
            dispatch(updateOrderInList(order))
        })

        socket.on('order:cancelled', ({ order }) => {
            dispatch(updateOrderInList(order))
        })

        socket.on('storage:warning', ({ message }) => {
            if (Notification.permission === 'granted') {
                new Notification('Cảnh báo nguyên liệu!', {
                    body: message,
                    icon: '/logo.png',
                })
            }
        })

        if (Notification.permission === 'default') {
            Notification.requestPermission()
        }

        return () => {
            socket.off('order:new')
            socket.off('order:statusChanged')
            socket.off('order:cancelled')
            socket.off('storage:warning')
        }
    }, [dispatch])
    return (
        <Routes>
            <Route path="/admin">
                <Route
                    path="login"
                    element={
                        <RedirectIfAuth>
                            <Login />
                        </RedirectIfAuth>
                    }
                />
                <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route
                path="/admin"
                element={
                    <RequireAuth>
                        <Layout />
                    </RequireAuth>
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route
                    path="products"
                    element={
                        <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                            <Products />
                        </RoleProtectedRoute>
                    }
                />
                <Route path="orders" element={<Orders />} />
                <Route
                    path="staffs"
                    element={
                        <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                            <Staffs />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="storage"
                    element={
                        <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                            <Storage />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="rooms"
                    element={
                        <RoleProtectedRoute allowedRoles={['admin', 'staff']}>
                            <Room />
                        </RoleProtectedRoute>
                    }
                />
            </Route>
            <Route
                path="/"
                element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route path="*" element={<Notfound />} />
        </Routes>
    )
}

export default App
