const jwt = require('jsonwebtoken') // Importa el paquete jsonwebtoken para verificar tokens JWT

exports.authRequired = (req, res, next) => {
    const { accessToken } = req.cookies // Obtiene el access token de la cookie
    
    // Si no hay token, devuelve un error 401
    if (!accessToken){ 
        return res.status(401).json({ message: 'No token, unauthorized' })
    }

    // Verifica el token usando la clave secreta
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) { // Si hay un error al verificar el token
            return res.status(403).json({ message: 'Invalid token' })
        }

        // Si el token es válido, guarda la información del usuario en req.user
        req.user = decoded 
        next()
    })
}