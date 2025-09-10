import { useState } from 'react'
import {
    User,
    LayoutDashboard,
    Warehouse,
    Coffee,
} from 'lucide-react'

export default function Navbar({ isPinned }) {
    const [isOpen, setIsOpen] = useState(false)
    // const [isPinned, setIsPinned] = useState(false)

    const menuItems = [
        { icon: <LayoutDashboard size={36} />, label: 'Trang chủ' },
        { icon: <Warehouse size={36} />, label: 'Kho' },
        { icon: <Coffee size={36} />, label: 'Đồ uống' },
        { icon: <User size={36} />, label: 'Hồ sơ' },
    ]

    return (
        <div
            onMouseEnter={() => !isPinned && setIsOpen(true)}
            onMouseLeave={() => !isPinned && setIsOpen(false)}
            className={`bg-base-200 fixed left-0 top-0 flex h-screen flex-col shadow-md transition-all duration-300 ${
                isOpen || isPinned ? 'w-56' : 'w-20'
            }`}
        >
            {/* Header with toggle pin */}
            <div className="flex items-center justify-between p-2">
                <span className="truncate font-bold">
                    {isOpen || isPinned ? 'MyApp' : 'M'}
                </span>
                {/* <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setIsPinned(!isPinned)}
                >
                    {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                </button> */}
            </div>

            <ul className="menu flex-1 p-2">
                {menuItems.map((item, idx) => (
                    <li key={idx}>
                        <a className="flex items-center gap-3">
                            {item.icon}
                            {(isOpen || isPinned) && (
                                <span className="text-2xl">{item.label}</span>
                            )}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
