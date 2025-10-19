import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import NotFound from './pages/NotFound'
import Product from './pages/Product'

const App = () => {
    return (
        <Routes>
            <Route path="/tables/:tableName" element={<Layout />}>
                <Route path="" element={<Home />} />
                <Route path="menu" element={<Menu />} />
            </Route>
            <Route
                path="/tables/:tableName/product/:id"
                element={<Product />}
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
