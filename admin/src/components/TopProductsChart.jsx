// ===== IMPORTS =====
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts'

import {
    fetchTopProducts,
    selectLoading,
    selectTopProducts,
} from '../store/admin/statisticsSlice'

// ===== CONSTANTS =====
const COLORS = ['#f59e0b', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5']

// ===== COMPONENT =====
const TopProductsChart = () => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()
    const topProducts = useSelector(selectTopProducts)
    const loading = useSelector(selectLoading)

    // ===== EFFECTS =====
    // Effect: Fetch top products when component mounts
    useEffect(() => {
        dispatch(fetchTopProducts(10))
    }, [dispatch])

    // ===== RENDER =====
    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    Top Sản phẩm Bán chạy
                </h3>
            </div>

            {loading ? (
                <div className="flex h-80 items-center justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            ) : !topProducts || topProducts.length === 0 ? (
                <div className="flex h-80 items-center justify-center">
                    <p className="text-gray-500">Chưa có dữ liệu</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={topProducts}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={90} />
                        <Tooltip
                            formatter={(value) => `${value} món`}
                            cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
                        />
                        <Bar dataKey="quantity" radius={[0, 8, 8, 0]}>
                            {topProducts.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

// ===== EXPORTS =====
export default TopProductsChart
