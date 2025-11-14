// ===== IMPORTS =====
import { LogOut, TextAlignJustify } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useLogout } from '../hooks/useLogout'
import NotificationBell from './NotificationBell'

// ===== COMPONENT =====
const Header = () => {
    // ===== REDUX STATE =====
    const { staff } = useSelector((state) => state.adminAuth)

    // ===== CUSTOM HOOKS =====
    const navigate = useNavigate()
    const handleLogout = useLogout()

    // ===== RENDER =====

    return (
        <div className="flex items-center justify-between bg-white px-10 py-8">
            <button
                className="cursor-pointer p-2 lg:hidden"
                onClick={() => document.getElementById('navbar-drawer').click()}
            >
                <TextAlignJustify />
            </button>

            <div className="dropdown-end flex flex-1 items-center justify-end gap-4">
                <NotificationBell />
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
                    className="hidden cursor-pointer items-center gap-2 p-2 md:flex"
                    onClick={() => handleLogout()}
                >
                    <LogOut />
                    Đăng Xuất
                </button>
            </div>
        </div>
    )
}

// ===== EXPORTS =====
export default Header
