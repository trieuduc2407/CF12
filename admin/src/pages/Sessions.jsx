import axios from 'axios'
import { RefreshCcw } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import SessionItem from '../components/SessionItem'
import socket from '../socket/socket'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const Sessions = () => {
    const [filteredSessions, setFilteredSessions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchSessions = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (statusFilter !== 'all') {
                params.append('status', statusFilter)
            }

            const response = await axios.get(
                `${API_URL}/api/admin/sessions?${params.toString()}`
            )

            if (response.data.success) {
                setFilteredSessions(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching sessions:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSessions()

        // Listen for session:statusChanged to refetch sessions
        const handleSessionStatusChanged = () => {
            console.log(
                '[Sessions] Session status changed, refetching sessions...'
            )
            fetchSessions()
        }

        socket.on('session:statusChanged', handleSessionStatusChanged)

        return () => {
            socket.off('session:statusChanged', handleSessionStatusChanged)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter])

    const handleClearFilters = () => {
        setStatusFilter('all')
    }

    return (
        <>
            <div className="mb-5 flex justify-between gap-2.5 rounded-lg bg-white p-2.5">
                <div className="flex flex-1 flex-col gap-2">
                    <select
                        className="select bg-white outline-1"
                        name="status_filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="active">Đang phục vụ</option>
                        <option value="completed">Đã thanh toán</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                </div>
                <button className="self-start" onClick={handleClearFilters}>
                    <RefreshCcw />
                </button>
            </div>

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
                                onPaymentSuccess={fetchSessions}
                            />
                        ))
                    ) : (
                        <p className="text-center font-semibold">
                            Không có phiên nào
                        </p>
                    )}
                </div>
            )}
        </>
    )
}

export default Sessions
