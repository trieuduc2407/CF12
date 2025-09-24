import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Login from './pages/Login'
import Register from './pages/Register'
import Staffs from './pages/Staffs'
import Storage from './pages/Storage'
import Notfound from './pages/Notfound'
import RequireAuth from './components/RequireAuth'
import RedirectIfAuth from './components/RedirectIfAuth'

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
                <Route path="register" element={<Register />} />
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
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="staffs" element={<Staffs />} />
                <Route path="storage" element={<Storage />} />
            </Route>
            <Route path="*" element={<Notfound />} />
        </Routes>
    )
}

export default App
