const User = require('../models/user.js')
const bcrypt = require('bcryptjs')
const { createAccessToken } = require('../utils/jwt.js')
const appError = require('../utils/appError.js')

exports.register = async (req, res, next) => {
    const { userName, email, password } = req.body
    try{

        // Hash the password
        const passwordHashed = await bcrypt.hash(password, 10)
        
        // Verifica que el usuario no exista con el mail
        const userExists = await User.findOne({ email })
        if(userExists){
            throw new appError('User already exists', 400)  // Si el usuario ya existe, lanza un error
        }

        // Crea el nuevo usuario
        const newUser = new User({ userName, email, password: passwordHashed })
        await newUser.save()

        // Crea el token con la funcion importada
        const token = await createAccessToken({ id: newUser._id })
        res.cookie('token', token, { httpOnly: true }) // Guardar el token en una cookie.
        // httpOnly: true significa que la cookie no es accesible desde JavaScript del lado del cliente, lo que ayuda a prevenir ataques XSS (Cross-Site Scripting).

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
            throw new appError('User not found', 404) // Si el usuario no existe, lanza un error
        }

        // Verifica que la contraseña sea correcta
        const isMatch = await bcrypt.compare(password, userFound.password)
        if(!isMatch){ // Si la contraseña no coincide
            throw new appError('Invalid credentials', 401) // Lanza un error de credenciales inválidas
        }

        // Crea el token con la funcion importada
        const token = await createAccessToken({ id: userFound._id })
        res.cookie('token', token, { httpOnly: true }) // Guardar el token en una cookie
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

