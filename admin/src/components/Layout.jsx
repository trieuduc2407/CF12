import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Header from './Header'
import Navbar from './Navbar'

const titleMap = [
    { path: '/admin/dashboard', title: 'Tổng quan' },
    { path: '/admin/products', title: 'Danh sách sản phẩm' },
    { path: '/admin/orders', title: 'Danh sách đơn' },
    { path: '/admin/sessions', title: 'Thanh toán' },
    { path: '/admin/staffs', title: 'Danh sách nhân viên' },
    { path: '/admin/storage', title: 'Danh sách kho' },
    { path: '/admin/rooms', title: 'Danh sách bàn' },
]

const Layout = () => {
    const location = useLocation()
    const [title, setTitle] = useState('')

    useEffect(() => {
        const currentTitle =
            titleMap.find((item) => item.path === location.pathname)?.title ||
            ''
        setTitle(currentTitle)
    }, [location.pathname])

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
                            {title}
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
