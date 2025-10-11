import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from './Header'

const Layout = () => {
    return (
        <div className="m-auto max-w-7xl">
            <Header />
            <Outlet />
        </div>
    )
}

export default Layout
