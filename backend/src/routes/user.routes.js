const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller') // Importa el controlador de usuario
const { authRequired } = require('../middlewares/validateToken') // Importa el middleware de autenticación
const { validateSchema } = require('../middlewares/validator.middleware') // Importa el middleware de validación
const { registerSchema, loginSchema } = require('../schemas/auth.schema') // Importa los esquemas de validación

// Define las rutas para el usuario
router.post('/register', validateSchema(registerSchema), userController.register)
router.post('/login', validateSchema(loginSchema), userController.login)
router.post('/logout', userController.logout)

module.exports = router