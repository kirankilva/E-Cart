const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String },
    address: { type: String },
    email: { type: String },
    gender: { type: String, default: 'Male' },
    phone: { type: String },
    password: { type: String },
    carts: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'Cart',  default: [] }
});

module.exports = mongoose.model('User', userSchema);