// ===== IMPORTS =====
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { setSession } from '../store/client/sessionSlice'
import { setUserFromStorage } from '../store/client/userSlice'

// ===== COMPONENT =====
const SessionProvider = ({ children }) => {
    // ===== REDUX STATE =====
    const dispatch = useDispatch()

    // ===== ROUTER =====
    const { tableName } = useParams()

    // ===== DERIVED STATE =====
    const clientId = localStorage.getItem('clientId')
    const userId = localStorage.getItem('userId')

    // ===== EFFECTS =====
    // Effect: Initialize session from localStorage
    useEffect(() => {
        if (clientId && tableName) {
            dispatch(
                setSession({
                    tableName,
                    clientId,
                    userId: userId || null,
                })
            )
        }

        if (userId) {
            dispatch(
                setUserFromStorage({
                    userId,
                })
            )
        }
    }, [clientId, tableName, userId, dispatch])

    // ===== RENDER =====
    return <>{children}</>
}

// ===== EXPORTS =====
export default SessionProvider
