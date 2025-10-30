import React from 'react'
import { useSelector } from 'react-redux'

import getNextStatus from '../helpers/getNextStatus'
import socket from '../socket/socket'
import formatDate from '../utils/formatDate'

const statusMap = {
    pending: 'Chờ xác nhận',
    preparing: 'Đang chuẩn bị',
    served: 'Đã phục vụ',
    paid: 'Đã thanh toán',
    cancelled: 'Đã hủy',
}

const statusColors = {
    pending: 'badge-warning',
    preparing: 'badge-info',
    served: 'badge-success',
    paid: 'badge-success',
    cancelled: 'badge-error',
}

const statusButtons = {
    pending: 'Chuẩn bị',
    preparing: 'Phục vụ',
}

const OrderItem = ({ order }) => {
    const { staff } = useSelector((state) => state.adminAuth)

    const orderNumber = `#${order._id.slice(-6).toUpperCase()}`

    const date = formatDate(order.createdAt)

    const handleStatusChange = (newStatus) => {
        const payload = {
            orderId: order._id,
            status: newStatus,
            staffId: staff?.id,
        }

        socket.emit('order:statusUpdate', payload)

        socket.once('order:updateSuccess', (order) => {
            document.getElementById(`detail_modal_${order._id}`)?.close()
        })

        socket.once('order:updateError', ({ message }) => {
            alert(`Lỗi cập nhật đơn hàng: ${message}`)
        })
    }

    return (
        <div className="flex flex-col gap-2.5 rounded-lg bg-white p-2.5">
            <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                    <p className="text-lg font-semibold">{orderNumber}</p>
                    <div className={`badge ${statusColors[order.status]}`}>
                        {statusMap[order.status]}
                    </div>
                </div>
                <p className="text-wrap font-light text-gray-500">
                    Bàn {order.sessionId.tableName}
                </p>
                <div className="font-light text-gray-500">
                    <p>{date[0]}</p>
                    <p className="hidden">{date[1]}</p>
                </div>
            </div>
            <div className="text-sm">
                <p className="mb-1.5 font-medium">Món ({order.items.length})</p>
                {order.items.map((item) => (
                    <div key={item.itemId}>
                        <p>
                            {item.quantity} x {item.productName}{' '}
                            <span className="font-light text-gray-500">
                                ({item.selectedSize} -{' '}
                                {item.selectedTemperature === 'ice'
                                    ? 'Đá'
                                    : 'Nóng'}
                                )
                            </span>
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex justify-between gap-4">
                <p className="flex-1 text-lg font-semibold">
                    {order.totalPrice.toLocaleString()}đ
                </p>
                <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                        document
                            .getElementById(`detail_modal_${order._id}`)
                            .showModal()
                    }
                >
                    Chi tiết
                </button>
            </div>
            <dialog id={`detail_modal_${order._id}`} className="modal">
                <div className="modal-box bg-white">
                    <p className="mb-2.5 text-center">
                        Chi tiết đơn hàng{' '}
                        <span className="font-semibold">{orderNumber}</span>
                    </p>
                    <div className="flex flex-col gap-1.5">
                        <p>
                            <span className="font-semibold">Bàn: </span>
                            {order.sessionId.tableName}
                        </p>
                        <div>
                            <span className="font-semibold">Trạng thái:</span>{' '}
                            <div
                                className={`badge ${statusColors[order.status]}`}
                            >
                                {statusMap[order.status]}
                            </div>
                        </div>
                        <p>
                            <span className="font-semibold">
                                Thời gian tạo:{' '}
                            </span>
                            {date.join(' ')}
                        </p>
                        <p className="font-semibold">Món đã gọi:</p>
                        {order.items.map((item) => (
                            <div
                                className="flex justify-between"
                                key={item.itemId}
                            >
                                <p>
                                    {item.quantity} x {item.productName}{' '}
                                    <span className="font-light text-gray-500">
                                        ({item.selectedSize} -{' '}
                                        {item.selectedTemperature === 'ice'
                                            ? 'Đá'
                                            : 'Nóng'}
                                        )
                                    </span>
                                </p>
                                <p className="font-semibold">
                                    {item.subTotal.toLocaleString()}đ
                                </p>
                            </div>
                        ))}
                        {order.notes && (
                            <p>
                                <span className="font-semibold">Ghi chú:</span>{' '}
                                {order.notes}
                            </p>
                        )}
                    </div>
                    <div className="mb-5 mt-5 flex justify-between text-xl font-semibold">
                        <p>Tổng:</p>
                        <p>{order.totalPrice.toLocaleString()}đ</p>
                    </div>

                    {/* Thông báo về thanh toán */}
                    {order.status === 'served' && (
                        <div className="alert alert-info mb-5 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="h-6 w-6 shrink-0 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                ></path>
                            </svg>
                            <span>
                                Để thanh toán, vui lòng đi tới{' '}
                                <strong>Phiên & Thanh toán</strong> trong menu
                            </span>
                        </div>
                    )}

                    <div className="flex justify-between">
                        {order.status === 'pending' && (
                            <button className="btn btn-error btn-sm w-1/3">
                                Hủy đơn
                            </button>
                        )}
                        {order.status in statusButtons && (
                            <button
                                className="btn btn-success btn-sm ml-auto w-1/3"
                                onClick={() =>
                                    handleStatusChange(
                                        getNextStatus(order.status)
                                    )
                                }
                            >
                                {statusButtons[order.status]}
                            </button>
                        )}
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    )
}

export default OrderItem
