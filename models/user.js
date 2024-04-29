const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
});

module.exports = mongoose.model('Users', userSchema);