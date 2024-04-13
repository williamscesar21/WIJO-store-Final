const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir modelo para registrar los mensajes que envía el comprador al vendedor
const ComentarioEnvioSchema = new Schema({
    id_usuario_mensaje: {// Este es el Id del usuario comprador que envía el mensaje
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true // Se corrigió "require" a "required"
    },
    comentario: {// Comentario que envía el usuario comprador
        type: String,
        minLength: 1, // Se corrigió "minLenght" a "minLength"
        maxLength: 5000, // Se corrigió "maxlength" a "maxLength"
        required: true
    },
    id_producto: {// Id del producto que se va a comprar
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    id_usuario_vendedor: { // Este id usuario debe ser igual al id_usuario_respuesta del Schema conversacionRespuestaSchema
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps: true,
    versionKey: false 
})

// Definir el modelo donde se le responde al comprador por parte del vendedor
const ComentarioRespuestaSchema = new Schema({
    respuesta: {// Respuesta al comentario del usuario por parte del vendedor
        type: String,
        required: true
    },
    id_ComentarioEnvio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ComentarioEnvio',
        required: true
    },
    id_usuario_mensaje: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true 
    }
},{
    timestamps: true,
    versionKey: false 
})

module.exports = {
    ComentarioEnvio: mongoose.model('ComentarioEnvio', ComentarioEnvioSchema),
    ComentarioRespuesta: mongoose.model('ComentarioRespuesta', ComentarioRespuestaSchema)
};
