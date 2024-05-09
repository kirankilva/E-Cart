const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderId: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number },
    amountPaid: { type: Number },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);