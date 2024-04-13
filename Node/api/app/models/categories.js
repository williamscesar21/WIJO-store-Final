const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definir modelo de datos para registrar categorías
const categoriaSchema = new Schema({
    nombre:{
        type: String,
        minlenght: 1,
        maxlength: 100,
        require: true
    },
    descripcion:{
        type: String,
        require: true
    }
},{
    timestamps: true,
    versionKey: false 
})

module.exports = mongoose.model('Categories', categoriaSchema); //Exportación del módulo categoria
