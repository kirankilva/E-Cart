const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cardNumber: { type: String, unique: true },
    nameOnCard: { type: String },
    cardType: { type: String },
    validTillMonth: { type: String },
    validTillYear: { type: String },
    cvv: { type: String },
    balance: { type: Number, default: 20000 }
});

module.exports = mongoose.model('Card', cardSchema);