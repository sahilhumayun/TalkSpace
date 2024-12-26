import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './db/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config({
    path: './.env'
})

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:"16Kb"}))
app.use(express.static('public'))
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use('/api/auth' , authRoutes)


const PORT = process.env.PORT || 8000
app.listen(PORT , ()=>{ 
    console.log('> Server is up and running on port : ' + PORT)
    connectDB()
})