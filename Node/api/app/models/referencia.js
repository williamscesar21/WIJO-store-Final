const mongoose = require('mongoose')

const ReferenciaSchema = new mongoose.Schema({
    referencia: {
        type: String,
        required: true,
        unique: true
    },
    usado: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('referencia', ReferenciaSchema)