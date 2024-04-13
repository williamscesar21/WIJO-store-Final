const express = require('express');
const router = express.Router();

const {crearComentarioEnvio, crearComentarioRespuesta, obtenerComentarioEnvio, obtenerComentarioRespuesta, obtenerComentarioEnvioId, obtenerComentarioRespuestaId } = require('../controllers/comentario');

router.post('/enviar',crearComentarioEnvio);
router.post('/responder',crearComentarioRespuesta);

router.get('/envio/:idProducto', obtenerComentarioEnvio);
router.get('/respondido/:id_ComentarioEnvio', obtenerComentarioRespuesta);

router.get('/:id/enviado', obtenerComentarioEnvioId);
router.get('/:id/respondido', obtenerComentarioRespuestaId);

module.exports = router;
