// ===== IMPORTS =====
import { DollarSign, ShoppingBag } from 'lucide-react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import RevenueChart from '../components/RevenueChart'
import StatCard from '../components/StatCard'
import TopProductsChart from '../components/TopProductsChart'
import {
    fetchOverview,
    fetchRevenue,
    fetchTopProducts,
} from '../store/admin/statisticsSlice'

// ===== COMPONENT =====
const Dashboard = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const { overview, loading } = useSelector((state) => state.adminStatistics)

    // ===== EFFECTS =====
    // Effect: Fetch initial statistics data
    useEffect(() => {
        dispatch(fetchOverview())
        dispatch(fetchRevenue('day'))
        dispatch(fetchTopProducts(10))
    }, [dispatch])

    // ===== RENDER =====
    return (
        <div className="space-y-6 p-6">
            <div>
                <p className="mt-1 text-gray-600">
                    Thống kê và báo cáo tổng quan
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <StatCard
                    title="Doanh thu hôm nay"
                    value={
                        overview?.todayRevenue?.toLocaleString('vi-VN') || '0'
                    }
                    suffix="đ"
                    icon={DollarSign}
                    loading={loading}
                />
                <StatCard
                    title="Số món đã bán hôm nay"
                    value={overview?.todaySales || 0}
                    icon={ShoppingBag}
                    loading={loading}
                />
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">
                    Biểu đồ doanh thu
                </h2>
                <RevenueChart />
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">
                    Top 10 sản phẩm bán chạy
                </h2>
                <TopProductsChart />
            </div>
        </div>
    )
}

// ===== EXPORTS =====
export default Dashboard
