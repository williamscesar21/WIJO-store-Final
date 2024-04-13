const ComentarioEnvio = require('../models/comentario').ComentarioEnvio;
const ComentarioRespuesta = require('../models/comentario').ComentarioRespuesta;

// Controlador para crear un comentario de envío
async function crearComentarioEnvio(req, res) {
    try {
        const comentario = await ComentarioEnvio.create(req.body);
        res.status(201).json(comentario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para crear un comentario de respuesta
async function crearComentarioRespuesta(req, res) {
    try {
        const comentario = await ComentarioRespuesta.create(req.body);
        res.status(201).json(comentario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para obtener todos los comentarios de envío
async function obtenerComentarioEnvio(req, res) {
    const { idProducto } = req.params;

    try {
        const comentarios = await ComentarioEnvio.find({ id_producto: idProducto }).populate('id_usuario_mensaje', 'nombre');
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




// Controlador para obtener todos los comentarios de respuesta
async function obtenerComentarioRespuesta(req, res) {
    const {id_ComentarioEnvio} = req.params
    try {
        const comentarios = await ComentarioRespuesta.find({id_ComentarioEnvio: id_ComentarioEnvio}).populate('id_usuario_mensaje', 'nombre');
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para obtener un comentario de envío por su ID
async function obtenerComentarioEnvioId(req, res) {
    try {
        const comentario = await ComentarioEnvio.findById(req.params.id);
        if (!comentario) {
            res.status(404).json({ message: 'Comentario de envío no encontrado' });
            return;
        }
        res.status(200).json(comentario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Controlador para obtener un comentario de respuesta por su ID
async function obtenerComentarioRespuestaId(req, res) {
    try {
        const comentario = await ComentarioRespuesta.findById(req.params.id);
        if (!comentario) {
            res.status(404).json({ message: 'Comentario de respuesta no encontrado' });
            return;
        }
        res.status(200).json(comentario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    crearComentarioEnvio,
    crearComentarioRespuesta,
    obtenerComentarioEnvio,
    obtenerComentarioRespuesta,
    obtenerComentarioEnvioId,
    obtenerComentarioRespuestaId
};
