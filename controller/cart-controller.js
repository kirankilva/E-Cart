const Cart = require('../models/cart');
const Products = require('../models/products');
const User = require('../models/user');


exports.getCart = async (req, res, next) => {
    try {
        const user = req.session.user;
        // if (!user) return res.redirect('/products');

        const loggedUser = await User.findOne({ email: user.email });

        const cartProducts = await Cart.find({ userId: loggedUser._id }).populate('productId');
        // const cartProducts = await Cart.find({ userId: 'arun@gmail.com' }).populate('productId');
        const isEmpty = cartProducts.length === 0;
        let totalAmount = cartProducts.reduce((total, product)=> total+product.productId.price, 0);

        res.render('cart/cart-products', {
            products: cartProducts,
            isEmpty,
            isUserLoggedIn: !!user,
            // isUserLoggedIn: true,
            loggedInUser: loggedUser.name,
            // loggedInUser: 'Krishna',
            totalAmount
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

        let loggedInUser = await User.findOne({ email: user.email });
        const newCart = await Cart.create({ productId: product._id, userId: loggedInUser._id });
        loggedInUser.carts.push(newCart._id);
        await loggedInUser.save();
        
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
        let loggedInUser = await User.findOne({ email: user.email });
        var cartIndex;
        for(const index in loggedInUser.carts) {
            if(loggedInUser.carts[index].toString() === cartId){
                cartIndex = index;
                break;
            }
        }
        loggedInUser.carts.splice(cartIndex, 1);
        await loggedInUser.save();
        await Cart.deleteOne({ _id: cartId, userId: loggedInUser._id });
        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
}