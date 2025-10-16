import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Product from './pages/Product'

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
            </Route>
            <Route path="/product/:id" element={<Product />} />
        </Routes>
    )
}

export default App
