import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { setSession } from '../store/client/sessionSlice'
import { setUserFromStorage } from '../store/client/userSlice'

const SessionProvider = ({ children }) => {
    const dispatch = useDispatch()
    const { tableName } = useParams()
    const clientId = localStorage.getItem('clientId')
    const userId = localStorage.getItem('userId')

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

    return <>{children}</>
}

export default SessionProvider
