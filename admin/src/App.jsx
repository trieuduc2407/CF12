import React from 'react'
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

const App = () => {
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
