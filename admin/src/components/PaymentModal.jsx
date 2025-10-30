// ===== IMPORTS =====
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import { useDebounce } from '../hooks/useDebounce'
import {
    checkoutSession,
    getSessionPaymentPreview,
} from '../store/admin/orderSlice'

// ===== COMPONENT =====
const PaymentModal = ({ session, modalId, onPaymentSuccess }) => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()

    // ===== LOCAL STATE =====
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [pointsToUse, setPointsToUse] = useState(0)
    const [preview, setPreview] = useState(null)
    const [currentPoints, setCurrentPoints] = useState(0)
    const [suggestions, setSuggestions] = useState({
        maxPoints: 0,
        roundPricePoints: 0,
    })
    const [isLoadingPreview, setIsLoadingPreview] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const [isNewUser, setIsNewUser] = useState(false)
    const [existingUserName, setExistingUserName] = useState('')

    // ===== CUSTOM HOOKS =====
    const debouncedPhone = useDebounce(phone, 500)

    // ===== CALLBACKS =====
    const fetchPreview = useCallback(
        async (phoneNumber, points) => {
            if (!phoneNumber || phoneNumber.length < 10) {
                setPreview(null)
                setCurrentPoints(0)
                setSuggestions({ maxPoints: 0, roundPricePoints: 0 })
                setIsNewUser(false)
                return
            }

            setIsLoadingPreview(true)
            setError('')

            try {
                const result = await dispatch(
                    getSessionPaymentPreview({
                        sessionId: session._id,
                        phone: phoneNumber,
                        pointsToUse: points,
                    })
                ).unwrap()

                if (result.data) {
                    setPreview(result.data.preview)
                    setCurrentPoints(result.data.currentPoints || 0)
                    setSuggestions(result.data.suggestions)
                    setIsNewUser(result.data.isNewUser || false)

                    if (result.data.userName) {
                        setExistingUserName(result.data.userName)
                        setName(result.data.userName)
                    } else {
                        setExistingUserName('')
                    }
                } else {
                    setIsNewUser(true)
                    setCurrentPoints(0)
                    setSuggestions({ maxPoints: 0, roundPricePoints: 0 })
                    setPointsToUse(0)
                    setExistingUserName('')
                    setPreview({
                        totalPrice: session.totalAmount,
                        pointsUsed: 0,
                        pointsDiscount: 0,
                        finalPrice: session.totalAmount,
                        pointsEarned: Math.floor(session.totalAmount / 10000),
                        totalPoints: Math.floor(session.totalAmount / 10000),
                        pointsChange: Math.floor(session.totalAmount / 10000),
                    })
                }
            } catch (err) {
                setError(err.message || 'Không thể tải preview')
                setPreview(null)
            } finally {
                setIsLoadingPreview(false)
            }
        },
        [dispatch, session._id, session.totalAmount]
    )

    const handleQuickAction = (action) => {
        if (isNewUser) return

        switch (action) {
            case 'max':
                setPointsToUse(suggestions.maxPoints)
                break
            case 'round':
                setPointsToUse(suggestions.roundPricePoints)
                break
            case 'none':
                setPointsToUse(0)
                break
            default:
                break
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!phone || phone.length < 10) {
            setError('Vui lòng nhập số điện thoại hợp lệ')
            return
        }

        if (pointsToUse > currentPoints) {
            setError('Số điểm sử dụng vượt quá điểm hiện có')
            return
        }

        setIsProcessing(true)
        setError('')

        try {
            await dispatch(
                checkoutSession({
                    sessionId: session._id,
                    phone,
                    name: name.trim() || undefined,
                    pointsToUse,
                })
            ).unwrap()

            document.getElementById(modalId)?.close()

            setPhone('')
            setName('')
            setPointsToUse(0)
            setPreview(null)
            setCurrentPoints(0)
            setSuggestions({ maxPoints: 0, roundPricePoints: 0 })
            setIsNewUser(false)
            setExistingUserName('')

            alert('Thanh toán thành công!')

            if (onPaymentSuccess) {
                onPaymentSuccess()
            }
        } catch (err) {
            setError(err.message || 'Thanh toán thất bại')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleClose = () => {
        setPhone('')
        setName('')
        setPointsToUse(0)
        setPreview(null)
        setCurrentPoints(0)
        setSuggestions({ maxPoints: 0, roundPricePoints: 0 })
        setError('')
        setIsNewUser(false)
        setExistingUserName('')
    }

    // ===== EFFECTS =====
    // Effect: Fetch preview when phone changes
    useEffect(() => {
        if (debouncedPhone && debouncedPhone.length >= 10) {
            fetchPreview(debouncedPhone, pointsToUse)
        } else if (!debouncedPhone || debouncedPhone.length < 10) {
            setPreview(null)
            setCurrentPoints(0)
            setSuggestions({ maxPoints: 0, roundPricePoints: 0 })
            setIsNewUser(false)
            setExistingUserName('')
        }
    }, [debouncedPhone, fetchPreview, pointsToUse])

    // Effect: Recalculate preview when points change
    useEffect(() => {
        if (phone && phone.length >= 10 && !isNewUser) {
            fetchPreview(phone, pointsToUse)
        } else if (phone && phone.length >= 10 && isNewUser) {
            setPreview({
                totalPrice: session.totalAmount,
                pointsUsed: 0,
                pointsDiscount: 0,
                finalPrice: session.totalAmount,
                pointsEarned: Math.floor(session.totalAmount / 10000),
                totalPoints: Math.floor(session.totalAmount / 10000),
                pointsChange: Math.floor(session.totalAmount / 10000),
            })
        }
    }, [pointsToUse, phone, isNewUser, fetchPreview, session.totalAmount])

    // ===== RENDER =====
    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box max-w-md bg-white">
                <h3 className="mb-4 text-center text-lg font-bold">
                    💳 Thanh toán - Bàn {session.tableName}
                </h3>
                <p className="mb-3 text-center text-sm text-gray-600">
                    Session #{session._id.slice(-6).toUpperCase()} |{' '}
                    {session.orders?.length || 0} đơn gọi món
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">
                                Số điện thoại
                            </span>
                        </label>
                        <input
                            type="tel"
                            className="input input-bordered w-full bg-white"
                            placeholder="0987654321"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={10}
                            required
                        />
                        {isNewUser && phone.length >= 10 && (
                            <p className="mt-1 text-xs text-blue-600">
                                Số điện thoại mới - sẽ tạo tài khoản khi thanh
                                toán
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text font-semibold">
                                Tên khách hàng
                                {!existingUserName && (
                                    <span className="ml-1 text-xs text-gray-500">
                                        (tùy chọn)
                                    </span>
                                )}
                            </span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full bg-white"
                            placeholder={
                                existingUserName
                                    ? existingUserName
                                    : 'Nhập tên (tùy chọn)'
                            }
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={existingUserName ? true : false}
                        />
                        {existingUserName && (
                            <p className="mt-1 text-xs text-gray-600">
                                ✓ Đã có tên trong hệ thống
                            </p>
                        )}
                    </div>

                    {!isNewUser && phone.length >= 10 && (
                        <div className="rounded-lg bg-gray-50 p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-semibold">
                                    Điểm hiện có:
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                    {currentPoints.toLocaleString()} điểm
                                </span>
                            </div>

                            {currentPoints > 0 && (
                                <>
                                    <label className="label">
                                        <span className="label-text font-semibold">
                                            Sử dụng điểm (1 điểm = 1,000đ)
                                        </span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max={suggestions.maxPoints}
                                        value={pointsToUse}
                                        onChange={(e) =>
                                            setPointsToUse(
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="range range-sm range-success"
                                    />
                                    <div className="mt-1 flex justify-between text-xs">
                                        <span>0</span>
                                        <span className="font-semibold text-green-600">
                                            {pointsToUse} điểm
                                        </span>
                                        <span>{suggestions.maxPoints}</span>
                                    </div>

                                    <div className="mt-3 flex gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline btn-xs flex-1"
                                            onClick={() =>
                                                handleQuickAction('none')
                                            }
                                        >
                                            Không dùng
                                        </button>
                                        {suggestions.roundPricePoints > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-info btn-xs flex-1"
                                                onClick={() =>
                                                    handleQuickAction('round')
                                                }
                                            >
                                                Làm tròn (
                                                {suggestions.roundPricePoints})
                                            </button>
                                        )}
                                        {suggestions.maxPoints > 0 && (
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-success btn-xs flex-1"
                                                onClick={() =>
                                                    handleQuickAction('max')
                                                }
                                            >
                                                Dùng hết (
                                                {suggestions.maxPoints})
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {isLoadingPreview && (
                        <div className="flex justify-center py-4">
                            <span className="loading loading-spinner loading-md"></span>
                        </div>
                    )}

                    {!isLoadingPreview && preview && (
                        <div className="rounded-lg border-2 border-green-500 bg-green-50 p-3">
                            <p className="mb-2 text-center text-sm font-bold text-green-700">
                                Tóm tắt thanh toán
                            </p>
                            <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Tổng tiền:</span>
                                    <span className="font-semibold">
                                        {preview.totalPrice.toLocaleString()}đ
                                    </span>
                                </div>
                                {preview.pointsUsed > 0 && (
                                    <>
                                        <div className="flex justify-between text-red-600">
                                            <span>
                                                Giảm giá ({preview.pointsUsed}{' '}
                                                điểm):
                                            </span>
                                            <span className="font-semibold">
                                                -
                                                {preview.pointsDiscount.toLocaleString()}
                                                đ
                                            </span>
                                        </div>
                                        <div className="divider my-1"></div>
                                    </>
                                )}
                                <div className="flex justify-between text-lg font-bold text-green-700">
                                    <span>Thanh toán:</span>
                                    <span>
                                        {preview.finalPrice.toLocaleString()}đ
                                    </span>
                                </div>
                                <div className="divider my-1"></div>
                                <div className="flex justify-between text-blue-600">
                                    <span>Điểm tích thêm:</span>
                                    <span className="font-semibold">
                                        +{preview.pointsEarned} điểm
                                    </span>
                                </div>
                                <div className="flex justify-between font-bold text-blue-700">
                                    <span>Tổng điểm sau giao dịch:</span>
                                    <span>{preview.totalPoints} điểm</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error text-sm">
                            <span>❌ {error}</span>
                        </div>
                    )}

                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            className="btn btn-ghost flex-1"
                            onClick={() => {
                                handleClose()
                                document.getElementById(modalId)?.close()
                            }}
                            disabled={isProcessing}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success flex-1"
                            disabled={
                                isProcessing ||
                                isLoadingPreview ||
                                !phone ||
                                !preview
                            }
                        >
                            {isProcessing ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Xác nhận thanh toán'
                            )}
                        </button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    )
}

// ===== EXPORTS =====
export default PaymentModal
