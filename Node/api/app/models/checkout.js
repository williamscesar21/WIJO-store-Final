const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CheckoutSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    shippingMethod: {
        type: String,
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerName: {
        type: String,
        required: true
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    operationId: {
        type: String,
        required: true
    },
    transactionId: {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
        required: false
    },
    shippingAddress: {
        type: String,
        required: true
    },
    extraNote: {
        type: String
    },
    shippingCompany: {
        type: String
    },
    productName: {
        type: String,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        default: function() {
            return this.productPrice * this.quantity;
        }
    }
}, { timestamps: true });

// Agregamos un hook para obtener el nombre del producto, el precio, el vendedor y el comprador antes de guardar el checkout
CheckoutSchema.pre('save', async function(next) {
    try {
        const product = await mongoose.model('Products').findById(this.productId);
        if (!product) {
            throw new Error('El producto asociado no existe');
        }
        this.productName = product.nombre;
        this.productPrice = product.precio;

        const sellerId = product.id_vendedor;
        const seller = await mongoose.model('Users').findById(sellerId);
        if (!seller) {
            throw new Error('El vendedor asociado no existe');
        }
        this.seller = seller._id;
        this.sellerName = seller.nombre + ' ' + seller.apellido;

        const userId = this.userId;
        const buyer = await mongoose.model('Users').findById(userId);
        if (!buyer) {
            throw new Error('El comprador asociado no existe');
        }
        this.buyer = buyer._id;
        

        next();
    } catch (error) {         
        next(error);
    }
});

module.exports = mongoose.model('Checkout', CheckoutSchema);
