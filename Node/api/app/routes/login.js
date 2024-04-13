// Importar Express y el controlador de login
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/login');

// Definir la ruta para el inicio de sesión
router.post('/', login);

// Exportar el enrutador
module.exports = router;

