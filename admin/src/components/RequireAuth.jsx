import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { checkAuth } from '../helper/checkAuth'
import { getMe } from '../store/auth/authSlice'

const RequireAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const location = useLocation()
    const dispatch = useDispatch()

    useEffect(() => {
        let mounted = true
        checkAuth().then((result) => {
            if (mounted) {
                setIsLoggedIn(result)
                setIsLoading(false)
            }
        })
        dispatch(getMe())
        return () => {
            mounted = false
        }
    }, [dispatch])

    if (isLoading) return null

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }

    return children
}

export default RequireAuth
