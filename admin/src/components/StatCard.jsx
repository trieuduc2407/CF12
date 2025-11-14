// ===== IMPORTS =====
import React from 'react'

// ===== COMPONENT =====
const StatCard = ({ title, value, icon: Icon, color = 'amber' }) => {
    // ===== DERIVED STATE =====
    const colorClasses = {
        amber: 'bg-amber-50 text-amber-600',
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    }

    // ===== RENDER =====
    return (
        <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>
                {Icon && (
                    <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    )
}

// ===== EXPORTS =====
export default StatCard
