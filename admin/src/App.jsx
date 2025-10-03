import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Staffs from './pages/Staffs'
import Storage from './pages/Storage'
import Notfound from './pages/Notfound'
import RequireAuth from './components/RequireAuth'
import RedirectIfAuth from './components/RedirectIfAuth'
import ChangePassword from './pages/ChangePassword'
import RoleProtectedRoute from './components/RoleProtectedRoute'

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
            </Route>

            <Route path="*" element={<Notfound />} />
        </Routes>
    )
}

export default App
