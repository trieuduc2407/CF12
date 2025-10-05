import { LogOut, TextAlignJustify } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'

import { logoutStaff } from '../store/auth/authSlice'

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { staff } = useSelector((state) => state.auth)

    const handleLogout = async () => {
        await dispatch(logoutStaff()).then((data) => {
            if (data?.payload?.success) {
                navigate('/admin/login', { replace: true })
            }
        })
    }

    return (
        <div className="flex items-center justify-between bg-white px-10 py-8">
            <button
                className="cursor-pointer p-2 lg:hidden"
                onClick={() => document.getElementById('navbar-drawer').click()}
            >
                <TextAlignJustify />
            </button>
            <div className="dropdown-end flex flex-1 justify-end">
                <button
                    className="mr-2"
                    popoverTarget="popover-changePassword"
                    style={{
                        anchorName: '--anchor-changePassword',
                    }}
                >
                    Xin chào,{' '}
                    <span className="font-medium hover:cursor-pointer">
                        {staff?.name}
                    </span>
                </button>
                <ul
                    className="dropdown menu rounded-box w-auto bg-white shadow-sm"
                    popover="auto"
                    id="popover-changePassword"
                    style={{
                        positionAnchor: '--anchor-changePassword',
                    }}
                >
                    <li>
                        <button
                            onClick={() => navigate('/admin/change-password')}
                        >
                            Đổi mật khẩu
                        </button>
                    </li>
                </ul>
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
