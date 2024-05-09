const User = require('../models/user');
const Card = require('../models/card');

exports.allCards = async(req, res, next) => {
    try {
        const user = req.session.user;
        if(!user) { return res.redirect('/products'); }
        let debitCards = [];
        let creditCards = [];
        if(user.currentOpenedProduct) {
            delete user.currentOpenedProduct;
            delete user.fromCart;
        }

        const fetchUser = await User.findOne({ email: user.email });
        const cards = await Card.find({ userId: fetchUser._id });

        debitCards = cards.filter(card => card.cardType === 'DEBIT');
        creditCards = cards.filter(card => card.cardType === 'CREDIT');
        res.render('cards/all-cards', { loggedInUser: fetchUser, debitCards, creditCards });
    } catch (error) {
        next(error);
    }
}

exports.getAddCard = async (req, res, next) => {
    try {
        const user = req.session.user;
        if(!user) { return res.redirect('/products'); }
        res.render('cards/add-card', { loggedInUser: user.name });
    } catch (error) {
        next(error);
    }
}

exports.addCard = async(req, res, next) => {
    try {
        var user = req.session.user;
        if(!user) { return res.redirect('/products'); }

        const fetchUser = await User.findOne({ email: user.email });
        const cardDetails = {
            userId: fetchUser._id,
            cardNumber: req.body.cnum,
            nameOnCard: req.body.cname,
            cardType: req.body['card-type'],
            validTillMonth: req.body['valid-till-month'],
            validTillYear: req.body['valid-till-year'],
            cvv: req.body.cvv
        }
        if(req.body.cancel) { return res.redirect('/user/cards'); }
        const card = await Card.create(cardDetails);
        fetchUser.savedCards.push({ cardId: card._id });
        await fetchUser.save();

        if(user.currentOpenedProduct) {
            return res.redirect(`/order?productId=${user.currentOpenedProduct}`);
        }
        if(user.fromCart) { return res.redirect('/cart'); }
        res.redirect('/user/cards');
    } catch (error) {
        next(error);
    }
}

exports.deleteCard = async (req, res, next) => {
    try {
        const user = req.session.user;
        if(!user) { return res.redirect('/products'); }

        const cardId = req.body['delete-card'];
        let fetchUser = await User.findOne({ email: user.email });
        await Card.deleteOne({_id: cardId});

        let index = fetchUser.savedCards.findIndex(card => card.cardId.toString() === cardId);
        fetchUser.savedCards.splice(index, 1);
        await fetchUser.save();

        res.redirect('/user/cards')
    } catch (error) {
        next(error);
    }
}

exports.getEditCard = async (req, res, next) => {
    try {
        const user = req.session.user;
        if(!user) { return res.redirect('/products'); }

        const cardId = req.query['edit-card'];
        const card = await Card.findOne({ _id: cardId })
        res.render('cards/edit-cards', { loggedInUser: user.name, card });
    } catch (error) {
        next(error);
    }
} 

exports.editCard = async (req, res, next) => {
    try {
        const user = req.session.user;
        if(!user) { return res.redirect('/products'); }

        const cardId = req.body.cid;
        const fetchUser = await User.findOne({ email: user.email });
        const cardDetails = {
            userId: fetchUser._id,
            cardNumber: req.body.cnum,
            nameOnCard: req.body.cname,
            cardType: req.body['card-type'],
            validTillMonth: req.body['valid-till-month'],
            validTillYear: req.body['valid-till-year'],
            cvv: req.body.cvv
        }
        if(req.body.cancel) { return res.redirect('/user/cards'); }
        await Card.findOneAndUpdate({ _id: cardId }, cardDetails, {new:true});
        res.redirect('/user/cards');
    } catch (error) {
        next(error);
    }
} 