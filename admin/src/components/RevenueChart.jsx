// ===== IMPORTS =====
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import {
    fetchRevenue,
    selectLoading,
    selectRevenue,
} from '../store/admin/statisticsSlice'

// ===== CONSTANTS =====
const PERIOD_OPTIONS = [
    { value: 'day', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'year', label: 'Năm nay' },
]

// ===== COMPONENT =====
const RevenueChart = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const { data } = useSelector(selectRevenue)
    const loading = useSelector(selectLoading)

    // ===== LOCAL STATE =====
    const [selectedPeriod, setSelectedPeriod] = useState('day')

    // ===== EFFECTS =====
    // Effect: Fetch revenue when period changes
    useEffect(() => {
        dispatch(fetchRevenue(selectedPeriod))
    }, [dispatch, selectedPeriod])

    // ===== HANDLERS =====
    const handlePeriodChange = (event) => {
        setSelectedPeriod(event.target.value)
    }

    // ===== RENDER =====
    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Biểu đồ Doanh thu
                </h3>
                <select
                    className="select select-bordered bg-white select-sm w-32"
                    value={selectedPeriod}
                    onChange={handlePeriodChange}
                >
                    {PERIOD_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex h-80 items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={320}>
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#f59e0b"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#f59e0b"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip
                            formatter={(value) => `${value.toLocaleString()} đ`}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f59e0b"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

// ===== EXPORTS =====
export default RevenueChart
