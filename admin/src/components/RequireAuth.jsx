// ===== IMPORTS =====
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { getMe } from '../store/auth/authSlice'

// ===== COMPONENT =====
const RequireAuth = ({ children }) => {
    // ===== LOCAL STATE =====
    const [isLoading, setIsLoading] = useState(true)

    // ===== REDUX STATE =====
    const { isAuthenticated } = useSelector((state) => state.adminAuth)

    // ===== CUSTOM HOOKS =====
    const location = useLocation()
    const dispatch = useDispatch()

    // ===== EFFECTS =====
    useEffect(() => {
        const token = localStorage.getItem('adminToken')

        if (!token) {
            setIsLoading(false)
            return
        }

        dispatch(getMe())
            .unwrap()
            .then(() => {
                setIsLoading(false)
            })
            .catch(() => {
                localStorage.removeItem('adminToken')
                setIsLoading(false)
            })
    }, [dispatch])

    // ===== RENDER =====
    if (isLoading) return null

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }

    return children
}

// ===== EXPORTS =====
export default RequireAuth
