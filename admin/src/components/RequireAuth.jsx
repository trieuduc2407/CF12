import React, { useEffect, useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { checkAuth } from '../helper/checkAuth'

const RequireAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const location = useLocation()

    useEffect(() => {
        let mounted = true
        checkAuth().then((result) => {
            if (mounted) {
                setIsLoggedIn(result)
                setIsLoading(false)
            }
        })
        return () => {
            mounted = false
        }
    }, [])

    if (isLoading) return null // hoặc spinner
    if (!isLoggedIn) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }
    return children
}

export default RequireAuth
