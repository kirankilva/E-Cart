const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' },
    user: { type: String }
});

module.exports = mongoose.model('Cart', cartSchema);