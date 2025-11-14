import { useDispatch, useSelector } from 'react-redux'

import { formatTimeAgo } from '../helpers/formatTimeAgo'
import {
    removeNotification,
    selectNotifications,
} from '../store/admin/notificationSlice'

const NotificationPanel = () => {
    const dispatch = useDispatch()
    const notifications = useSelector(selectNotifications)

    const notificationList = Object.entries(notifications)
        .map(([tableName, data]) => ({
            tableName,
            timestamp: data.timestamp,
        }))
        .sort((a, b) => b.timestamp - a.timestamp)

    const handleAcknowledge = (tableName) => {
        dispatch(removeNotification(tableName))
    }

    return (
        <div
            tabIndex={0}
            className="menu dropdown-content left-1/2 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-white p-0 shadow-lg ring-1 ring-black ring-opacity-5 sm:w-96"
        >
            <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="text-lg font-semibold text-gray-900">
                    Thông báo
                </h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notificationList.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                        Không có thông báo
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {notificationList.map(({ tableName, timestamp }) => (
                            <li
                                key={tableName}
                                className="px-4 py-3 hover:bg-gray-50"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            Bàn {tableName} có yêu cầu gọi nhân
                                            viên
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {formatTimeAgo(timestamp)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleAcknowledge(tableName)
                                        }
                                        className="rounded bg-amber-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-amber-600"
                                    >
                                        Xác nhận
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default NotificationPanel
