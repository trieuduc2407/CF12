import React from 'react'

import formatDate from '../utils/formatDate'
import PaymentModal from './PaymentModal'

const SessionItem = ({ session, onPaymentSuccess }) => {
    const sessionNumber = `#${session._id.slice(-6).toUpperCase()}`

    const date = formatDate(session.createdAt)

    const isActive = session.status === 'active'
    const isCompleted = session.status === 'completed'

    return (
        <div className="flex flex-col gap-2.5 rounded-lg bg-white p-2.5">
            <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                    <p className="text-lg font-semibold">{sessionNumber}</p>
                    <div
                        className={`badge ${
                            isActive
                                ? 'badge-info'
                                : isCompleted
                                  ? 'badge-success'
                                  : 'badge-error'
                        }`}
                    >
                        {isActive
                            ? 'Đang phục vụ'
                            : isCompleted
                              ? 'Đã thanh toán'
                              : 'Đã hủy'}
                    </div>
                </div>
                <p className="text-wrap font-light text-gray-500">
                    Bàn {session.tableName}
                </p>
                <div className="font-light text-gray-500">
                    <p>{date[0]}</p>
                    <p className="text-xs">{date[1]}</p>
                </div>
            </div>

            <div className="text-sm">
                <p className="mb-1.5 font-medium">
                    Đơn gọi món ({session.orders?.length || 0})
                </p>
                {session.orders && session.orders.length > 0 ? (
                    session.orders.map((order) => (
                        <div
                            key={order._id}
                            className="mb-2 rounded border border-gray-200 p-2"
                        >
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-xs font-semibold">
                                    #{order._id.slice(-6).toUpperCase()}
                                </span>
                                <span
                                    className={`badge badge-xs ${
                                        order.status === 'pending'
                                            ? 'badge-warning'
                                            : order.status === 'preparing'
                                              ? 'badge-info'
                                              : order.status === 'served'
                                                ? 'badge-success'
                                                : 'badge-neutral'
                                    }`}
                                >
                                    {order.status === 'pending'
                                        ? 'Chờ'
                                        : order.status === 'preparing'
                                          ? 'Làm'
                                          : order.status === 'served'
                                            ? 'Xong'
                                            : order.status}
                                </span>
                            </div>
                            {order.items?.slice(0, 2).map((item, idx) => (
                                <p key={idx} className="text-xs text-gray-600">
                                    {item.quantity} x {item.productName}
                                </p>
                            ))}
                            {order.items?.length > 2 && (
                                <p className="text-xs text-gray-400">
                                    ... và {order.items.length - 2} món khác
                                </p>
                            )}
                            <p className="mt-1 text-xs font-semibold">
                                {order.totalPrice.toLocaleString()}đ
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-gray-400">Chưa có đơn nào</p>
                )}
            </div>

            <div className="flex items-center justify-between gap-4 border-t pt-2">
                <p className="flex-1 text-lg font-bold">
                    Tổng: {session.totalAmount.toLocaleString()}đ
                </p>
                {isActive && (
                    <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                            document
                                .getElementById(`payment_modal_${session._id}`)
                                .showModal()
                        }
                    >
                        💰 Thanh toán
                    </button>
                )}
                {isCompleted && session.finalPrice !== undefined && (
                    <div className="text-right text-xs">
                        <p className="font-semibold text-green-600">
                            Đã thanh toán: {session.finalPrice.toLocaleString()}
                            đ
                        </p>
                        {session.pointsUsed > 0 && (
                            <p className="text-gray-600">
                                Dùng {session.pointsUsed} điểm
                            </p>
                        )}
                        {session.pointsEarned > 0 && (
                            <p className="text-blue-600">
                                Tích {session.pointsEarned} điểm
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {isActive && (
                <PaymentModal
                    session={session}
                    modalId={`payment_modal_${session._id}`}
                    onPaymentSuccess={onPaymentSuccess}
                />
            )}
        </div>
    )
}

export default SessionItem
