const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, default: 'Male' },
    phone: { type: String, required: true},
    password: { type: String, required: true },
    carts: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'Cart',  default: [] }
});

module.exports = mongoose.model('User', userSchema);