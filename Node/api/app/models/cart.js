const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [CartItemSchema],
    total: {
        type: Number,
        required: true,
        default: 0 // Establecer el valor predeterminado del total como 0
    }
}, {
    timestamps: true,
    versionKey: false,
    strictPopulate: false
});

module.exports = mongoose.model('Cart', CartSchema);
