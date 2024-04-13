const jwt = require('jsonwebtoken');
const UserModel = require('../models/users');


const verifyToken = async (req,res,next)=>{
    const token = req.headers['authorization'];

    if(!token){
        return res.status(403).json({message: "Token no enviado"})
    }

    try{
        const decoded = jwt.verify(token, process.env.DB_KEY)
        req.userId = decoded.id
        const user = await UserModel.findById(req.userId)
        if(!user){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        next()

    }catch(error){
        return res.status(401).json({message: "Error"})
    }
}

module.exports = { verifyToken }

// Crear un middleware para verificar rol de usuario
// Por ejemplo que en una ruta se pueda acceder si la persona es administrador


