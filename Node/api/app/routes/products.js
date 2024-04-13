const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const path = require('path');

const uploadsDirectory = path.join(__dirname, 'app', 'uploads');

// Rutas para los productos
router.get('/', productController.obtenerProductos);
router.get('/:id', productController.verProductoPorId);
router.post('/', productController.crearProducto);
router.put('/:id', productController.actualizarProductoPorId);
router.delete('/:id', productController.eliminarProductoPorId);

// Ruta para buscar productos por palabra clave en el nombre
router.get('/buscar/:palabraClave', productController.buscarProductosPorPalabraClave);

// Ruta para servir imágenes estáticas desde la carpeta de uploads
router.use('/uploads', express.static('../node/api/app/uploads'));

module.exports = router;
