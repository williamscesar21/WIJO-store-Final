const express = require('express');
const router = express.Router();
const { subirReferencia, verTodasReferencias } = require('../controllers/referencia');

// Ruta para subir una nueva referencia
router.post('/', subirReferencia);

// Ruta para ver todas las referencias
router.get('/', verTodasReferencias);

module.exports = router;
