const express = require('express');
const router = express.Router();
const verificarReferencia = require('../middlewares/verificarReferencia');
const { obtenerSaldo, recargarSaldo, transferirSaldo, verTransacciones, obtenerTodasBilleteras } = require('../controllers/wallet');

// Ruta para obtener el saldo de la billetera de un usuario
router.get('/:userId/saldo', obtenerSaldo);

// Ruta para recargar el saldo de la billetera de un usuario
router.put('/:userId/recargar', verificarReferencia ,recargarSaldo);

// Ruta para transferir el saldo de la billetera de un usuario
router.post('/transferir', transferirSaldo);

// Ruta para ver las transacciones de la billetera de un usuario
router.get('/:userId/transacciones', verTransacciones);

// Ruta para ver la billetera de todos los usuarios
router.get('/wallets', obtenerTodasBilleteras);

module.exports = router;
