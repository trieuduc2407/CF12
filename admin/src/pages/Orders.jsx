import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import socket from '../socket/socket'
import {
    clearFilters,
    getAllOrders,
    setFilters,
} from '../store/admin/orderSlice'

const statusColors = {
    pending: 'badge-warning',
    preparing: 'badge-info',
    ready: 'badge-success',
    served: 'badge-neutral',
    cancelled: 'badge-error',
}

const statusLabels = {
    pending: 'Chờ xử lý',
    preparing: 'Đang chuẩn bị',
    ready: 'Sẵn sàng',
    served: 'Đã phục vụ',
    cancelled: 'Đã hủy',
}

const Orders = () => {
    const dispatch = useDispatch()
    const { filteredOrders, filters, loading } = useSelector(
        (state) => state.adminOrder
    )
    const { user } = useSelector((state) => state.adminAuth)

    const [selectedOrder, setSelectedOrder] = useState(null)

    useEffect(() => {
        dispatch(getAllOrders())
    }, [dispatch])

    const handleStatusChange = (orderId, newStatus) => {
        console.log(
            `🔄 [Orders] Changing status for order ${orderId} to ${newStatus}`
        )

        // Emit socket event for realtime update
        socket.emit('order:statusUpdate', {
            orderId,
            status: newStatus,
            staffId: user?._id,
        })

        // Listen for response
        socket.once('order:updateSuccess', ({ order }) => {
            console.log('✅ [Orders] Order updated successfully:', order)
        })

        socket.once('order:updateError', ({ message }) => {
            console.error('❌ [Orders] Update error:', message)
            alert(message)
        })
    }

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }))
    }

    const handleClearFilters = () => {
        dispatch(clearFilters())
    }

    const getOrderNumber = (order) => {
        return `#${order._id.slice(-6).toUpperCase()}`
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Quản lý đơn hàng</h1>
                <button
                    className="btn btn-sm btn-primary"
                    onClick={() => dispatch(getAllOrders())}
                    disabled={loading}
                >
                    {loading ? 'Đang tải...' : 'Làm mới'}
                </button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 rounded-lg bg-white p-4 shadow">
                <select
                    className="select select-bordered"
                    value={filters.status}
                    onChange={(e) =>
                        handleFilterChange('status', e.target.value)
                    }
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="ready">Sẵn sàng</option>
                    <option value="served">Đã phục vụ</option>
                    <option value="cancelled">Đã hủy</option>
                </select>

                <input
                    type="text"
                    className="input input-bordered"
                    placeholder="Tìm theo bàn..."
                    value={filters.tableName}
                    onChange={(e) =>
                        handleFilterChange('tableName', e.target.value)
                    }
                />

                <input
                    type="date"
                    className="input input-bordered"
                    value={filters.date || ''}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                />

                <button
                    className="btn btn-outline"
                    onClick={handleClearFilters}
                >
                    Xóa bộ lọc
                </button>
            </div>

            {/* Orders List */}
            <div className="grid gap-4">
                {loading && filteredOrders.length === 0 ? (
                    <div className="text-center">Đang tải...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center">Không có đơn hàng nào</div>
                ) : (
                    filteredOrders.map((order) => (
                        <div
                            key={order._id}
                            className="rounded-lg bg-white p-4 shadow hover:shadow-lg"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold">
                                        {getOrderNumber(order)}
                                    </h3>
                                    <span
                                        className={`badge ${statusColors[order.status]}`}
                                    >
                                        {statusLabels[order.status]}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Bàn {order.tableName}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {formatDate(order.createdAt)}
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="mb-2 text-sm font-semibold">
                                    Món ({order.items.length}):
                                </p>
                                <ul className="space-y-1 text-sm">
                                    {order.items.map((item, idx) => (
                                        <li key={idx} className="flex gap-2">
                                            <span>
                                                {item.quantity}x{' '}
                                                {item.productName}
                                            </span>
                                            <span className="text-gray-500">
                                                ({item.selectedSize} -{' '}
                                                {item.selectedTemperature ===
                                                'hot'
                                                    ? 'Nóng'
                                                    : 'Lạnh'}
                                                )
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {order.notes && (
                                <p className="mb-3 text-sm italic text-gray-600">
                                    Ghi chú: {order.notes}
                                </p>
                            )}

                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">
                                    {order.totalPrice.toLocaleString()}đ
                                </span>

                                <div className="flex gap-2">
                                    {order.status === 'pending' && (
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() =>
                                                handleStatusChange(
                                                    order._id,
                                                    'preparing'
                                                )
                                            }
                                        >
                                            Bắt đầu chuẩn bị
                                        </button>
                                    )}
                                    {order.status === 'preparing' && (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() =>
                                                handleStatusChange(
                                                    order._id,
                                                    'ready'
                                                )
                                            }
                                        >
                                            Sẵn sàng
                                        </button>
                                    )}
                                    {order.status === 'ready' && (
                                        <button
                                            className="btn btn-sm btn-neutral"
                                            onClick={() =>
                                                handleStatusChange(
                                                    order._id,
                                                    'served'
                                                )
                                            }
                                        >
                                            Đã phục vụ
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-sm btn-ghost"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        Chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <dialog
                    id="order_detail_modal"
                    className="modal modal-open"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="modal-box max-w-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="mb-4 text-lg font-bold">
                            Chi tiết đơn hàng {getOrderNumber(selectedOrder)}
                        </h3>

                        <div className="space-y-3">
                            <p>
                                <strong>Bàn:</strong> {selectedOrder.tableName}
                            </p>
                            <p>
                                <strong>Trạng thái:</strong>{' '}
                                <span
                                    className={`badge ${statusColors[selectedOrder.status]}`}
                                >
                                    {statusLabels[selectedOrder.status]}
                                </span>
                            </p>
                            <p>
                                <strong>Thời gian:</strong>{' '}
                                {formatDate(selectedOrder.createdAt)}
                            </p>

                            <div>
                                <strong>Món đã gọi:</strong>
                                <ul className="mt-2 space-y-2">
                                    {selectedOrder.items.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex justify-between rounded bg-gray-100 p-2"
                                        >
                                            <span>
                                                {item.quantity}x{' '}
                                                {item.productName}
                                            </span>
                                            <span>
                                                {item.subTotal.toLocaleString()}
                                                đ
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {selectedOrder.notes && (
                                <p>
                                    <strong>Ghi chú:</strong>{' '}
                                    {selectedOrder.notes}
                                </p>
                            )}

                            <p className="text-xl font-bold">
                                Tổng:{' '}
                                {selectedOrder.totalPrice.toLocaleString()}đ
                            </p>
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn"
                                onClick={() => setSelectedOrder(null)}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    )
}

export default Orders
