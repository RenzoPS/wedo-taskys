// Importar dependencias
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const errorHandler = require('./middlewares/errorHandler')
require('dotenv').config()

// Import rutas
const userRoutes = require('./routes/user.routes')
const groupRoutes = require('./routes/group.routes')

// Crear la aplicación
const app = express()

// Conectar a la base de datos
const connectDB = require('./config/db')
connectDB()

// Middleware
// CORS configurado específicamente para tu frontend
app.use(cors({
  origin: 'http://localhost:5173', // Tu frontend
  credentials: true, // Para permitir cookies (JWT)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}))

app.use(express.json())  // Para analizar el cuerpo de las solicitudes JSON
app.use(helmet())  // Protege la aplicación de ataques comunes
app.use(morgan('dev'))  // Registra las solicitudes HTTP en la consola
app.use(cookieParser())  // Analiza las cookies de las solicitudes

// Api
app.use('/api/users', userRoutes)
app.use('/api/groups', groupRoutes)

// Middleware de manejo de errores
app.use(errorHandler)  // Maneja los errores de la aplicación

module.exports = app