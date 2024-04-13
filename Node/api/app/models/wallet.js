const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdraw', 'buy', 'transfer', 'sell'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const WalletSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [TransactionSchema]
},{
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Wallet', WalletSchema);
