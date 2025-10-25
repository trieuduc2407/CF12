import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

const RedirectIfAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        setIsLoggedIn(!!token)
        setIsLoading(false)
    }, [])

    if (isLoading) return null

    if (isLoggedIn) {
        return <Navigate to="/admin/dashboard" replace />
    }

    return children
}

export default RedirectIfAuth
