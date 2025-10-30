// ===== IMPORTS =====
import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

// ===== COMPONENT =====
const RedirectIfAuth = ({ children }) => {
    // ===== LOCAL STATE =====
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    // ===== EFFECTS =====
    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        setIsLoggedIn(!!token)
        setIsLoading(false)
    }, [])

    // ===== RENDER =====
    if (isLoading) return null

    if (isLoggedIn) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return children
}

// ===== EXPORTS =====
export default RedirectIfAuth
