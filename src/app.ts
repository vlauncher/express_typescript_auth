import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import { connectDB } from './config/db'

import rateLimit from 'express-rate-limit';
import cookieSession from 'cookie-session';


dotenv.config()

const app = express()

connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet())
app.use(compression())

app.use(cookieSession({
    secret: process.env.JWT_SECRET!,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  }));

// Mount routes with prefix /api/v1/auth
import authRoutes from './routes/users.routes'
import profileRoutes from './routes/profile.routes'
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/profile', profileRoutes)

// Global error handler
app.use(errorHandler)

export default app
