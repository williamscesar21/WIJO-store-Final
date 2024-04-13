const express = require('express');
const router = express.Router();
const { agregarProductoAlCarrito, verCarritoDeUsuario, borrarProductoDelCarrito, actualizarCantidadProductoEnCarrito } = require('../controllers/cart');

// Ruta para agregar un producto al carrito de un usuario
router.post('/', agregarProductoAlCarrito);

// Ruta para ver el carrito de un usuario
router.get('/:userId', verCarritoDeUsuario);

// Ruta para borrar un producto del carrito de un usuario
router.delete('/:userId/:productId', borrarProductoDelCarrito);

router.put('/:userId/:productId', actualizarCantidadProductoEnCarrito);

module.exports = router;
