import 'dotenv/config'
import http from 'http'

import { createApp } from './app.js'
import { initSocket } from './socket/index.js'

const PORT = process.env.PORT || 4000

const startServer = async () => {
    const app = await createApp()
    const server = http.createServer(app)

    initSocket(server)

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()
