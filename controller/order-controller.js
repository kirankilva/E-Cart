const User = require('../models/user');
const Product = require('../models/products');
const Card = require('../models/card');
const Order = require('../models/order');

exports.orderDetails = async(req, res, next) => {
    try {
        const user = req.session.user;
        const productId = req.query.productId;
        var cardClicked = false;
        var cardDetails;

        if(!user) { return res.redirect('/user/login'); }
        if(!user.currentOpenedProduct) {
            user.currentOpenedProduct = productId;
        }
        if(req.body.cancel) {
            return res.redirect(`/order?productId=${user.currentOpenedProduct}`);
        }
        const product = await Product.findOne({ productId });
        const fetchUser = await User.findOne({ email: user.email }).populate('savedCards.cardId');
        if(req.query.cardId) {
            cardClicked = true;
            cardDetails = await Card.findById({ _id: req.query.cardId });
        }
        if(req.body.submit) {
            if(req.body.password===fetchUser.password && req.body.cvv===cardDetails.cvv) {
                cardDetails.balance -= (product.price - (product.price * 0.05));
                await cardDetails.save();
                const order = {
                    userId: fetchUser._id,
                    cardId: cardDetails._id,
                    productId: product._id,
                    amountPaid: product.price,
                    quantity: 1
                }
                await Order.create(order);
                return res.redirect('/user/orders');
            }
            return res.json({message: 'invalid credential'});
        }
        res.render('order/order-product', { product, cards: fetchUser.savedCards, loggedInUser: user.name, cardClicked, cardDetails });
    } catch (error) {
        next(error);
    }
}

exports.myOrders = async (req, res, next) => {
    try {
        const user = req.session.user;
        if(!user) { return res.redirect('/user/login'); }

        const fetchUser = await User.findOne({ email: user.email });
        const myOrders = await Order.find({}).populate([
            { path: 'userId' }, { path: 'cardId' }, { path: 'productId' },
        ]);
        res.render('order/my-orders', { myOrders, loggedInUser: fetchUser.name });
    } catch (error) {
        next(error);
    }
}