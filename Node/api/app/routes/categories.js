const express = require('express');
const { crearCategoria, verTodasCategorias, eliminarCategorias } = require('../controllers/categories');
const router = express.Router();

router.post('/', crearCategoria)
router.get('/', verTodasCategorias)
router.delete('/:categoryId', eliminarCategorias)

module.exports = router