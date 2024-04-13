const mongoose = require('mongoose');
// Definir modelo de datos para registrar productos
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    nombre:{
        type: String,
        minlength: 1,
        maxlength: 100,
        required: true
    },
    descripcion:{
        type: String,
        minlength: 1,
        maxlength: 5000,
        required: true
    },
    marca:{
        type: String,
        minlength: 1,
        maxlength: 500,
        required: true
    },
    cantidad_disponible:{
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
              return /^[0-9]+$/.test(value);
            },
            message: 'Cantidad inválida',
        }
    },
    envio:{
        type: Number,
        required: true
    },
    costo:{
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
              return /^[0-9]+$/.test(value);
            },
            message: 'Costo inválido',
        }
    },
    iva: {
        type: Number,
        required: true,
        default: function() {
            return parseFloat((this.costo * 0.16).toFixed(2)); // Calcula el IVA como el 16% del costo
        }
    },
    precio: {
        type: Number,
        required: true,
        default: function() {
            return this.envio + this.costo + this.iva; // Calcula el precio como el envio + el costo + el IVA
        }
    },
    comision:{
        type: Number,
        required: true,
        default: function() {
            return parseFloat((this.precio * 0.05).toFixed(2));
        }
    }
    ,
    id_vendedor:{
        type: String,
        required: true
    },
    nombre_vendedor:{
        type: String,
        required: true
    }
    ,
    estado_producto:{
        type: String,
        required: true
    },
    calificacion:{
        type: Number,
        required: true,
        default: 0
    },
    images: [
        {
            fileName: String,
            contentType: String
        }
    ],
    eliminar:{
        type: Boolean,
        default: false,
        required: true
    },
    id_categoria:{
        type: String,
        required: true
    }
},{
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('Products', ProductSchema); //Exportación del módulo productos
