import { RefreshCcw } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { fetchSessions as fetchSessionsApi } from '../apis/sessionApi'
import SessionItem from '../components/SessionItem'
import socket from '../socket/socket'

const Sessions = () => {
    const [filteredSessions, setFilteredSessions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')

    const loadSessions = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const sessions = await fetchSessionsApi(statusFilter)
            setFilteredSessions(sessions)
        } catch (error) {
            console.error('[Sessions] Error loading sessions:', error)
            setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadSessions()

        // Listen for session:statusChanged to refetch sessions
        const handleSessionStatusChanged = () => {
            console.log(
                '[Sessions] Session status changed, refetching sessions...'
            )
            loadSessions()
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
                            Không có phiên nào
                        </p>
                    )}
                </div>
            )}
        </>
    )
}

export default Sessions
