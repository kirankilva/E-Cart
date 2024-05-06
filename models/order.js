const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderId: { type: String },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);