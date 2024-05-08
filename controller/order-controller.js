const User = require('../models/user');
const Product = require('../models/products');
const Card = require('../models/card');

exports.orderDetails = async(req, res, next) => {
    try {
        const user = req.session.user;
        const productId = req.query.productId;
        var cardClicked = false;
        var cardDetails;

        if(!user) { return res.redirect('/login'); }
        if(!user.currentOpenedProduct) {
            user.currentOpenedProduct = productId;
        }
        if(req.body.cancel) {
            return res.redirect(`/order?productId=${user.currentOpenedProduct}`);
        }
        console.log(req.body, req.query);
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
                return res.redirect('/products');
            }
            return res.json({message: 'invalid credential'});
        }
        res.render('order/order-product', { product, cards: fetchUser.savedCards, loggedInUser: user.name, cardClicked, cardDetails });
    } catch (error) {
        next(error);
    }
}
