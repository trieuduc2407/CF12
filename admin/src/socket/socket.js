import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
})

socket.on('connect', () => {
})

socket.on('disconnect', () => {
})

socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error)
})

export default socket
