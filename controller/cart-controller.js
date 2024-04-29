const Cart = require('../models/cart');
const Products = require('../models/products');

exports.getCart = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (!user) return res.redirect('/products');

        const cartProducts = await Cart.find({ user: user.email }).populate('cartId');
        const isEmpty = cartProducts.length === 0;

        res.render('cart/cart-products', {
            products: cartProducts,
            isEmpty,
            isUserLoggedIn: !!user,
            loggedInUser: user.name
        });
    } catch (error) {
        next(error);
    }
}

exports.addToCart = async (req, res, next) => {
    try {
        const productId = req.body.productId || req.params.productId;
        const product = await Products.findOne({ productId });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login');
        }
        await Cart.create({ cartId: product._id, user: user.email });
        res.redirect('/products');
    } catch (error) {
        next(error);
    }
}

exports.deleteFromCart = async (req, res, next) => {
    try {
        const cartId = req.body.cartId;
        const user = req.session.user;
        if (!user) {
            return res.redirect('/login');
        }
        await Cart.deleteOne({ _id: cartId, user: user.email });
        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
}