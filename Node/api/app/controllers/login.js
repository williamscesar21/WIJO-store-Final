const UserModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        // Capturar los datos enviados por el usuario
        const { correo, clave } = req.body;

        // Buscar al usuario para saber si existe
        const user = await UserModel.findOne({ correo: correo });

        // Validar si el usuario existe
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Comparar la contraseña
        const checkPassword = await UserModel.comparePassword(clave, user.clave);

        // Validar si la contraseña es válida
        if (!checkPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Creamos el token de acceso
        const token = jwt.sign({ id: user._id }, process.env.DB_KEY, { expiresIn: '1m' });

        // Enviamos el token de acceso y los datos del usuario en la respuesta
        res.json({ token: token, user: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { login };
