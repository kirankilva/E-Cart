const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productId: { type: String },
    name: { type: String },
    imageURL: { type: String },
    description: { type: String },
    specifications: { type: String },
    price: { type: Number },
    model: { type: String, lowercase: true },
    category: { type: String, lowercase: true },
});

module.exports = mongoose.model('Product', productSchema);