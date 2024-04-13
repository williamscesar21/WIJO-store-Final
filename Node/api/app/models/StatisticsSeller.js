const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatisticsSellerSchema = new Schema({
    id_vendedor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    productos_vendidos: {
        type: Number,
        default: 0
    },
    ventas_totales: {
        type: Number,
        default: 0
    },
    cantidad_productos_vendidos:{
        type: Number,
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('StatisticsSeller', StatisticsSellerSchema);
