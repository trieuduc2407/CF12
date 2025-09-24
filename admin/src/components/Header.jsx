import React from 'react'
import { TextAlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { logoutStaff } from '../store/auth/authSlice'
import { Navigate } from 'react-router-dom'

const Header = () => {
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logoutStaff())
        return <Navigate to="/admin/auth/login" replace />
    }

    return (
        <div className="flex items-center justify-between bg-white px-10 py-8">
            <button
                className="cursor-pointer p-2 lg:hidden"
                onClick={() => document.getElementById('navbar-drawer').click()}
            >
                <TextAlignJustify />
            </button>
            <div className="flex flex-1 justify-end">
                <button
                    className="flex cursor-pointer items-center gap-2 p-2"
                    onClick={() => handleLogout()}
                >
                    <LogOut />
                    Đăng Xuất
                </button>
            </div>
        </div>
    )
}

export default Header
