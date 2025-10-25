import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

import { getMe } from '../store/auth/authSlice'

const RequireAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation()
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state) => state.adminAuth)

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

    if (isLoading) return null

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />
    }

    return children
}

export default RequireAuth
