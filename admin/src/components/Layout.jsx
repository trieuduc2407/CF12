import React from 'react'
import { Outlet } from 'react-router-dom'

import Header from './Header'
import Navbar from './Navbar'

const title = {
    '/admin/dashboard': 'Tổng quan',
    '/admin/products': 'Danh sách sản phẩm',
    '/admin/orders': 'Danh sách đơn hàng',
    '/admin/staffs': 'Danh sách nhân viên',
    '/admin/storage': 'Danh sách kho',
    '/admin/rooms': 'Danh sách bàn',
}

const Layout = () => {
    return (
        <div className="flex h-screen w-full flex-row">
            <div className="drawer lg:drawer-open">
                <input
                    id="navbar-drawer"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col overflow-hidden">
                    <Header />
                    <main className="scrollbar-hide flex flex-1 flex-col overflow-y-auto p-4">
                        <p className="my-5 text-center text-lg font-semibold">
                            {title[window.location.pathname]}
                        </p>
                        <Outlet />
                    </main>
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="navbar-drawer"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu min-h-full w-auto bg-white p-4">
                        <div className="flex h-auto flex-row items-center">
                            <img
                                className="w-15 h-15 rounded-lg border-4 border-gray-200"
                                src="/logo.png"
                                alt=""
                            />
                            <p className="pl-2 text-lg font-semibold">
                                Cà phê mười hai
                            </p>
                        </div>
                        <Navbar />
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Layout
