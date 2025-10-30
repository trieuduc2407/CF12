// ===== IMPORTS =====
import React from 'react'
import { useSelector } from 'react-redux'

// ===== COMPONENT =====
const RoleProtectedRoute = ({ allowedRoles, children }) => {
    // ===== REDUX STATE =====
    const { staff } = useSelector((state) => state.adminAuth)

    // ===== RENDER =====
    if (!staff) return null

    if (!allowedRoles.includes(staff.role)) {
        return (
            <div className="flex min-h-screen justify-center">
                <span className="mt-10 text-2xl font-medium">
                    Bạn không được cấp quyền truy cập chức năng này
                </span>
            </div>
        )
    }

    return children
}

// ===== EXPORTS =====
export default RoleProtectedRoute
