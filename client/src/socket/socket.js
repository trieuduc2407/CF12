import { io } from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid'

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const clientId = localStorage.getItem('clientId') || uuidv4()
localStorage.setItem('clientId', clientId)

const socket = io(URL, {
    transports: ['websocket', 'polling'],
    query: { uuid: clientId },
})

if (import.meta.env.DEV) {
    socket.on('connect', () => {
        console.log('Connected to socket server with id:', socket.id)
    })
    socket.on('disconnect', () => {
        console.log('Disconnected from socket server')
    })
}

export default socket
