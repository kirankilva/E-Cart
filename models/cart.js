const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Cart', cartSchema);