import 'cally'
import { RefreshCcw } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { fetchSessions as fetchSessionsApi } from '../apis/sessionApi'
import Calendar from '../components/Calendar'
import SessionItem from '../components/SessionItem'
import getTodayDate from '../helpers/getTodayDate'
import socket from '../socket/socket'

const Sessions = () => {
    const [filteredSessions, setFilteredSessions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState(getTodayDate())
    const [showPopover, setShowPopover] = useState(false)
    const calendarRef = useRef(new Date())

    const loadSessions = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const sessions = await fetchSessionsApi(statusFilter, dateFilter)
            setFilteredSessions(sessions)
        } catch (error) {
            console.error('[Sessions] Error loading sessions:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }, [statusFilter, dateFilter])

    useEffect(() => {
        loadSessions()

        const handleSessionStatusChanged = () => {
            loadSessions()
        }

        socket.on('session:statusChanged', handleSessionStatusChanged)

        return () => {
            socket.off('session:statusChanged', handleSessionStatusChanged)
        }
    }, [loadSessions])

    useEffect(() => {
        const calendar = calendarRef.current
        if (calendar) {
            const handleDateChange = (event) => {
                const selectedDate = event.target.value
                console.log('[Sessions] Date changed:', selectedDate)
                setDateFilter(selectedDate)
                setShowPopover(false)
            }
            calendar.addEventListener('change', handleDateChange)
            return () => {
                calendar.removeEventListener('change', handleDateChange)
            }
        }
    }, [])

    const handleClearFilters = () => {
        setStatusFilter('all')
        setDateFilter(getTodayDate())
    }

    return (
        <>
            <div className="mb-5 flex justify-between gap-2.5 rounded-lg bg-white p-2.5">
                <div className="flex flex-1 flex-col gap-2 md:flex-row">
                    <select
                        className="select bg-white outline-1 md:w-1/2"
                        name="status_filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang phục vụ</option>
                        <option value="completed">Đã thanh toán</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <Calendar
                        showPopover={showPopover}
                        setShowPopover={setShowPopover}
                        date={dateFilter}
                        calendarRef={calendarRef}
                    />
                </div>
                <button className="self-start" onClick={handleClearFilters}>
                    <RefreshCcw />
                </button>
            </div>

            {error && (
                <div className="alert alert-error mb-4">
                    <span>❌ {error}</span>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredSessions.length > 0 ? (
                        filteredSessions.map((session) => (
                            <SessionItem
                                key={session._id}
                                session={session}
                                onPaymentSuccess={loadSessions}
                            />
                        ))
                    ) : (
                        <p className="text-center font-semibold">
                            Không có bàn nào đang hoạt động
                        </p>
                    )}
                </div>
            )}
        </>
    )
}

export default Sessions
