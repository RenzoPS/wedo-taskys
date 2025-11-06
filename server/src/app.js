// Importar dependencias
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
const path = require('path')
const errorHandler = require('./middlewares/errorHandler')
require('dotenv').config()

// Import rutas
const userRoutes = require('./routes/user.routes')
const groupRoutes = require('./routes/group.routes')
const listRoutes = require('./routes/list.routes')
const taskRoutes = require('./routes/task.routes')
const invitationRoutes = require('./routes/invitation.routes')

// Crear la aplicación
const app = express()

// Conectar a la base de datos
const connectDB = require('./config/db')
connectDB()

// Middleware
// CORS configurado específicamente para el frontend
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
app.use(express.json())  // Para analizar el cuerpo de las solicitudes JSON
app.use(helmet())  // Protege la aplicación de ataques comunes
app.use(morgan('dev'))  // Registra las solicitudes HTTP en la consola
app.use(cookieParser())  // Analiza las cookies de las solicitudes

// Rate limiting global - Solo contra ataques masivos
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100, // 100 requests por minuto (1.6 req/segundo)
  message: 'Too many requests, please slow down',
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// Api
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)
app.use('/api/lists', listRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/invitations', invitationRoutes)
// Middleware de manejo de errores
app.use(errorHandler)  // Maneja los errores de la aplicación

module.exports = app