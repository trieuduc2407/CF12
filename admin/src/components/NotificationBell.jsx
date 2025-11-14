import { Bell } from 'lucide-react'
import { useSelector } from 'react-redux'

import { selectUnreadCount } from '../store/admin/notificationSlice'
import NotificationPanel from './NotificationPanel'

const NotificationBell = () => {
    const unreadCount = useSelector(selectUnreadCount)

    return (
        <div className="dropdown dropdown-center">
            <button
                tabIndex={0}
                className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            <NotificationPanel />
        </div>
    )
}

export default NotificationBell
