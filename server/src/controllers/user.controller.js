const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createAccessToken, createRefreshToken } = require('../utils/jwt.js')
const appError = require('../utils/appError.js')
const { logAudit } = require('../utils/auditLogger.js')

// Configuración de cookies para producción
const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production'
    return {
        httpOnly: true,
        secure: isProduction, // Solo HTTPS en producción
        sameSite: isProduction ? 'none' : 'lax', // 'none' permite cross-site en producción
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        path: '/'
    }
}

exports.register = async (req, res, next) => {
    const { userName, email, password } = req.body
    try{

        // Hash the password
        const passwordHashed = await bcrypt.hash(password, 10)
        
        // Verifica que el usuario no exista con el mail
        const userExists = await User.findOne({ email })
        if(userExists){
            throw new appError('El usuario ya existe', 400)  // Si el usuario ya existe, lanza un error
        }

        // Crea el nuevo usuario
        const newUser = new User({ userName, email, password: passwordHashed })
        await newUser.save()

        // Registrar en auditoría
        logAudit('CREATE', 'USER', newUser._id.toString(), newUser._id.toString(), { userName, email })

        // Crea los tokens con las funciones importadas
        const accessToken = await createAccessToken({ id: newUser._id })
        const refreshToken = await createRefreshToken({ id: newUser._id })
        
        // Guardar los tokens en cookies separadas
        const cookieOptions = getCookieOptions()
        res.cookie('accessToken', accessToken, cookieOptions)
        res.cookie('refreshToken', refreshToken, cookieOptions)

        res.status(201).json({
            id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        })

    } catch (e) {
        next(e)  // Llama al siguiente middleware de manejo de errores
    }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body
    try{

        // Verifica que el mail exista
        const userFound = await User.findOne({ email })
        if(!userFound){
            throw new appError('El usuario no existe', 404) // Si el usuario no existe, lanza un error
        }

        // Verifica que la contraseña sea correcta
        const isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch){ // Si la contraseña no coincide
            throw new appError('La contraseña es incorrecta', 401) // Lanza un error de credenciales inválidas
        }

        // Crea los tokens con las funciones importadas
        const accessToken = await createAccessToken({ id: userFound._id })
        const refreshToken = await createRefreshToken({ id: userFound._id })
        
        // Guardar los tokens en cookies separadas
        const cookieOptions = getCookieOptions()
        res.cookie('accessToken', accessToken, cookieOptions)
        res.cookie('refreshToken', refreshToken, cookieOptions)
        return res.status(200).json({
            id: userFound._id,
            userName: userFound.userName,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        })

    } catch (e) {
        next(e)  
    }
}

exports.refreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken
        if(!oldRefreshToken){
            throw new appError('Refresh token not found', 401)
        }

        // Decodifica el token
        const decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        // Verifica que el usuario exista
        const userFound = await User.findById(decoded.id)
        if(!userFound){
            throw new appError('User not found', 404)
        }

        // Genera nuevos tokens
        const newAccessToken = await createAccessToken({ id: decoded.id })
        const newRefreshToken = await createRefreshToken({ id: decoded.id })
        
        // Guardar el access token en una cookie.
        const cookieOptions = getCookieOptions()
        res.cookie('accessToken', newAccessToken, cookieOptions)
        res.cookie('refreshToken', newRefreshToken, cookieOptions)

        res.status(200).json({ message: 'Tokens refreshed' })
    } catch (e) {
        next(e)
    }
}

exports.logout = async (req, res, next) => {
    try{
        const cookieOptions = getCookieOptions()
        res.clearCookie('accessToken', cookieOptions) // Elimina la cookie del access token
        res.clearCookie('refreshToken', cookieOptions) // Elimina la cookie del refresh token
        return res.status(200).json({ message: 'Logout successful' }) // Respuesta de éxito
    } catch (e) {
        next(e)  // Llama al siguiente middleware de manejo de errores
    }
}