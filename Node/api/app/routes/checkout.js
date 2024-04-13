const express = require('express');
const router = express.Router();
const { comprarProducto, verCheckoutsDeUsuario, verCheckoutsDeTodos } = require('../controllers/checkout');

// Ruta para comprar un producto
router.post('/comprar', comprarProducto);

// Ruta para ver los checkouts de un usuario
router.get('/compra/:userId', verCheckoutsDeUsuario);

// Ruta para ver los checkouts de todos los usuarios
router.get('/compra', verCheckoutsDeTodos);

module.exports = router;
