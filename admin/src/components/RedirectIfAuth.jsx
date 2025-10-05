import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { checkAuth } from '../helper/checkAuth'

const RedirectIfAuth = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)

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

    if (isLoading) return null
    if (isLoggedIn) {
        return <Navigate to="/admin/dashboard" replace />
    }
    return children
}

export default RedirectIfAuth
