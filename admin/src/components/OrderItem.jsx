import React from 'react'
import { useSelector } from 'react-redux'

import getNextStatus from '../helpers/getNextStatus'
import socket from '../socket/socket'

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
    served: 'Thanh toán',
}

const OrderItem = ({ order }) => {
    const { staff } = useSelector((state) => state.adminAuth)

    const orderNumber = `#${order._id.slice(-6).toUpperCase()}`

    const formatedDate = new Date(order.createdAt)
        .toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        .split(' ')

    const handleStatusChange = (newStatus) => {
        const payload = {
            orderId: order._id,
            status: newStatus,
            staffId: staff?.id, 
        }
        console.log('📤 [OrderItem] Emitting order:statusUpdate:', payload)

        socket.emit('order:statusUpdate', payload)

        socket.once('order:updateSuccess', ({ order: updatedOrder }) => {
            console.log(
                '✅ [OrderItem] Order updated successfully:',
                updatedOrder._id
            )
            document.getElementById(`detail_modal_${order._id}`)?.close()
        })

        socket.once('order:updateError', ({ message }) => {
            console.error('❌ [OrderItem] order:updateError:', message)
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
                    <p>{formatedDate[0]}</p>
                    <p className="hidden">{formatedDate[1]}</p>
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
                            {formatedDate.join(' ')}
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
                        {order.notes ? (
                            <p>
                                <span className="font-semibold">Ghi chú:</span>{' '}
                                {order.notes}
                            </p>
                        ) : null}
                    </div>
                    <div className="mb-10 mt-5 flex justify-between text-xl font-semibold">
                        <p>Tổng:</p>
                        <p>{order.totalPrice.toLocaleString()}đ</p>
                    </div>
                    <div className="flex justify-between">
                        {order.status === 'pending' ? (
                            <button className="btn btn-error btn-sm w-1/3">
                                Hủy đơn
                            </button>
                        ) : null}
                        {order.status in statusButtons ? (
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
                        ) : null}
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
