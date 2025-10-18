import cookieParser from 'cookie-parser'
import express from 'express'

import { corsMiddleware } from './corsConfig.js'

export const applyMiddleware = (app) => {
    app.use(corsMiddleware)
    app.use(express.json())
    app.use(cookieParser())
}
