const Order = require('../models/order');
const User = require('../models/user');
const Product = require('../models/products');
const Card = require('../models/card');

exports.orderDetails = async(req, res, next) => {
    try {
        const user = req.session.user;
        const productId = req.body.productId;
        if(!user) { return res.redirect('/login'); }
        if(!user.currentOpenedProduct) {
            user.currentOpenedProduct = productId;
        }
        console.log(req.session);

        // const productId = 'P-004';
        const product = await Product.findOne({ productId });
        const fetchUser = await User.findOne({ email: user.email }).populate('savedCards.cardId')

        res.render('order/order-product', { product, cards: fetchUser.savedCards, loggedInUser: user.name });
    } catch (error) {
        next(error);
    }
}
