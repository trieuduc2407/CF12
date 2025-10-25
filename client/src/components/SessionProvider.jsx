import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import { setSession } from '../store/client/sessionSlice'

const SessionProvider = ({ children }) => {
    const dispatch = useDispatch()
    const { tableName } = useParams()
    const clientId = localStorage.getItem('clientId')

    useEffect(() => {
        if (clientId && tableName) {
            dispatch(setSession({ tableName, clientId }))
        }
    }, [clientId, tableName, dispatch])

    return <>{children}</>
}

export default SessionProvider
