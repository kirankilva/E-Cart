const Cart = require('../models/cart');
const Card = require('../models/card');
const Products = require('../models/products');
const User = require('../models/user');


exports.getCart = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (!user) return res.redirect('/products');
        var cardClicked = false;
        var cardDetails;

        const loggedUser = await User.findOne({ email: user.email }).populate('savedCards.cardId');
        const cartProducts = await Cart.find({ userId: loggedUser._id }).populate('productId');
        if(req.query.cardId) {
            cardClicked = true;
            cardDetails = await Card.findById({ _id: req.query.cardId });
        }
        if(req.body.cancel) {
            return res.redirect(`/cart`);
        }
        const isEmpty = cartProducts.length === 0;
        let totalAmount = cartProducts.reduce((total, product)=> total+(product.productId.price*product.quantity), 0);
        if(!user.fromCart) {
            user.fromCart = true
        }
        console.log(req.session);
        res.render('cart/cart-products', {
            products: cartProducts,
            cards: loggedUser.savedCards,
            isEmpty,
            isUserLoggedIn: !!user,
            loggedInUser: loggedUser.name,
            totalAmount,
            cardClicked,
            cardDetails
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
        let searchProductInCart = await Cart.findOne({ productId: product._id, userId: loggedInUser._id });
        if (searchProductInCart) {
            searchProductInCart.quantity += 1;
            await searchProductInCart.save();
            user.addedToCart = true;
            return res.redirect('/products');
        }
        const newCart = await Cart.create({ productId: product._id, userId: loggedInUser._id });
        loggedInUser.carts.push(newCart._id);
        await loggedInUser.save();
        user.addedToCart = true;
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
        req.session.user.carts -= 1;
        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
}

exports.quantityCalculate = async(req, res, next) => {
    try {
        let decrementValue = req.body.decrement;
        let incrementValue = req.body.increment;
        let cartProduct;
        if(incrementValue) {
            cartProduct = await Cart.findById({ _id: incrementValue });
            cartProduct.quantity += 1;
            await cartProduct.save();
        } else {
            cartProduct = await Cart.findById({ _id: decrementValue });
            if(cartProduct.quantity === 1) {
                cartProduct.quantity = 1;
            } else {
                cartProduct.quantity -= 1;
            }
            await cartProduct.save();
        }
        res.redirect('/cart')
    } catch (error) {
        next(error)
    }
}

exports.payment = async (req, res, next) => {
    try {
        const user = req.session.user;
        if (!user) { return res.redirect('/login'); }

        const fetchUser = await User.findOne({ email: user.email });
        const card = await Card.findById({ _id: req.query.cardId });
        const cartProducts = await Cart.find({ userId: fetchUser._id }).populate('productId');
        let totalAmount = cartProducts.reduce((total, product)=> total+(product.productId.price*product.quantity), 0);

        console.log(req.body, req.query);
        if(req.body.submit) {
            if(req.body.password === fetchUser.password && req.body.cvv === card.cvv) {
                card.balance -= totalAmount;
                await card.save();
                return res.redirect('/products');
            }
            return res.json({message: 'invalid credential'});
        }
        res.redirect('/cart')
    } catch (error) {
        next(error);
    }
}