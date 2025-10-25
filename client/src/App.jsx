import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import SessionProvider from './components/SessionProvider'
import Cart from './pages/Cart'
import Home from './pages/Home'
import Menu from './pages/Menu'
import NotFound from './pages/NotFound'
import Product from './pages/Product'

const App = () => {
    return (
        <SessionProvider>
            <Routes>
                <Route path="/tables/:tableName" element={<Layout />}>
                    <Route path="" element={<Home />} />
                    <Route path="menu" element={<Menu />} />
                </Route>
                <Route path="/tables/:tableName">
                    <Route path="product/:id" element={<Product />} />
                    <Route path="cart" element={<Cart />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </SessionProvider>
    )
}

export default App
