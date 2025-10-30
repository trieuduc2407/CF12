// ===== IMPORTS =====
import 'cally'
import { RefreshCcw } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Calendar from '../components/Calendar'
import OrderItem from '../components/OrderItem'
import getTodayDate from '../helpers/getTodayDate'
import sortOrders from '../helpers/sortOrders'
import socket from '../socket/socket'
import {
    clearFilters,
    getAllOrders,
    setFilters,
} from '../store/admin/orderSlice'

// ===== COMPONENT =====
const Orders = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const { filteredOrders, filters } = useSelector((state) => state.adminOrder)

    // ===== LOCAL STATE =====
    const [showPopover, setShowPopover] = useState(false)
    const [date, setDate] = useState(getTodayDate())

    // ===== REFS =====
    const calendarRef = useRef(new Date())

    // ===== CALLBACKS =====
    const handleFilterChange = useCallback(
        (key, value) => {
            dispatch(setFilters({ [key]: value }))
        },
        [dispatch]
    )

    const handleClearFilters = () => {
        setDate(getTodayDate())
        dispatch(clearFilters())
    }

    // ===== EFFECTS =====
    // Effect: Load orders and listen to socket events
    useEffect(() => {
        dispatch(getAllOrders())
        const handleSessionStatusChanged = () => {
            dispatch(getAllOrders())
        }

        socket.on('session:statusChanged', handleSessionStatusChanged)

        return () => {
            socket.off('session:statusChanged', handleSessionStatusChanged)
        }
    }, [dispatch])

    // Effect: Handle calendar date change
    useEffect(() => {
        const calendar = calendarRef.current
        if (calendar) {
            const handleDateChange = (event) => {
                const selectedDate = event.target.value
                setDate(selectedDate)
                setShowPopover(false)
                handleFilterChange('date', selectedDate)
            }
            calendar.addEventListener('change', handleDateChange)
            return () => {
                calendar.removeEventListener('change', handleDateChange)
            }
        }
    }, [handleFilterChange])

    // ===== RENDER =====
    return (
        <>
            <div className="mb-5 flex justify-between gap-2.5 rounded-lg bg-white p-2.5">
                <div className="flex flex-1 flex-col gap-2 md:flex-row">
                    <select
                        className="select bg-white outline-1 md:w-1/2"
                        name="filter_select"
                        value={filters.status}
                        onChange={(event) =>
                            handleFilterChange('status', event.target.value)
                        }
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="preparing">Đang chuẩn bị</option>
                        <option value="served">Đã phục vụ</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <Calendar
                        showPopover={showPopover}
                        setShowPopover={setShowPopover}
                        date={date}
                        calendarRef={calendarRef}
                    />
                </div>
                <button
                    className="self-start"
                    onClick={() => handleClearFilters()}
                >
                    <RefreshCcw />
                </button>
            </div>
            <div className="flex flex-col gap-4">
                {filteredOrders.length > 0 ? (
                    sortOrders(filteredOrders).map((order) => (
                        <OrderItem key={order._id} order={order} />
                    ))
                ) : (
                    <p className="text-center font-semibold">
                        Không có đơn nào
                    </p>
                )}
            </div>
        </>
    )
}

// ===== EXPORTS =====
export default Orders
