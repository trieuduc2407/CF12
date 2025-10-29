import React from 'react'
import { Outlet } from 'react-router-dom'

const BaseLayout = ({ children }) => {
    return (
        <div className="m-auto max-w-7xl">
            {children}
            <Outlet />
        </div>
    )
}

export default BaseLayout
