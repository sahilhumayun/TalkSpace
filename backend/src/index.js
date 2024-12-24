import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import { connectDB } from './db/db.js'

dotenv.config()
const app = express()

app.use('/api/auth' , authRoutes)


const PORT = process.env.PORT || 8000
app.listen(PORT , ()=>{ 
    console.log('> Server is up and running on port : ' + PORT)
    connectDB()
})