const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true},
    password: { type: String, required: true },
    carts: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'Cart',  default: [] },
    savedCards: [{
        cardId: {type: mongoose.Schema.Types.ObjectId, ref:'Card'}
    }]
});

module.exports = mongoose.model('User', userSchema);