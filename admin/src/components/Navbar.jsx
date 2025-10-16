import {
    Coffee,
    LayoutDashboard,
    List,
    LogOut,
    ReceiptText,
    Users,
    Warehouse,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useLogout } from '../hooks/useLogout'

const adminNavbarItems = [
    {
        name: 'dashboard',
        title: 'Tổng quan',
        icon: <LayoutDashboard />,
        path: '/admin/dashboard',
    },
    {
        name: 'products',
        title: 'Sản phẩm',
        icon: <Coffee />,
        path: '/admin/products',
    },
    {
        name: 'orders',
        title: 'Đơn hàng',
        icon: <ReceiptText />,
        path: '/admin/orders',
    },
    {
        name: 'users',
        title: 'Nhân viên',
        icon: <Users />,
        path: '/admin/staffs',
    },
    {
        name: 'storage',
        title: 'Nguyên liệu',
        icon: <Warehouse />,
        path: '/admin/storage',
    },
    {
        name: 'room',
        title: 'Danh sách bàn',
        icon: <List />,
        path: '/admin/rooms',
    },
]

const Navbar = () => {
    const navigate = useNavigate()
    const handleLogout = useLogout()

    return (
        <nav className="mt-8">
            {adminNavbarItems.map((item) => (
                <button
                    key={item.name}
                    onClick={() => {
                        navigate(item.path)
                        document.getElementById('navbar-drawer').click()
                    }}
                    className="my-5 flex cursor-pointer items-center gap-4"
                >
                    {item.icon}
                    <span>{item.title}</span>
                </button>
            ))}
            <button
                className="my-5 flex cursor-pointer items-center gap-4 md:hidden"
                onClick={() => handleLogout()}
            >
                <LogOut />
                Đăng Xuất
            </button>
        </nav>
    )
}

export default Navbar
