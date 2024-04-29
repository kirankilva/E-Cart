const Products = require('../models/products');
const Cart = require('../models/cart');

const cartProductsCount = async function(req) {
    let user = req.session.user;
    if(user) {
        const cartProducts = await Cart.find({ user: user.email });
        return cartProducts.length;
    }
    return 0;
}

exports.getAllProducts = async (req, res, next) => {
    try {
        let isUserLoggedIn = false;
        let loggedInUser = '';
        const products = await Products.find({});
        const count = await cartProductsCount(req, res);
        if(req.session.user) {
            isUserLoggedIn = true;
            loggedInUser = req.session.user.name;
        }
        res.render('products/all-products', { products, count, isUserLoggedIn, loggedInUser });
    } catch (error) {
        next(error);
    }
}

exports.notFound = (req, res, next) => {
    try {
        res.render('products/not-found');
    } catch (error) {
        next(error);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        let isUserLoggedIn = false;
        let loggedInUser = '';
        const id = req.params.id;
        const product = await Products.findOne({ productId: id });
        if(req.session.user) {
            isUserLoggedIn = true;
            loggedInUser = req.session.user.name;
        }
        const count = await cartProductsCount(req);
        res.render('products/view-product', { product, isUserLoggedIn, count, loggedInUser });
    } catch (error) {
        next(error);
    }
}

exports.searchProducts = async (req, res, next) => {
    try {
        let isUserLoggedIn = false;
        let loggedInUser = '';
        const query = req.query.query;
        if (!query) return res.redirect('/products');

        const products = await Products.find({ model: query });
        if (products.length === 0) return res.redirect('/not-found');
        const count = await cartProductsCount(req);
        if(req.session.user) {
            isUserLoggedIn = true;
            loggedInUser = req.session.user.name;
        }
        res.render('products/search-products', { products, query, count, isUserLoggedIn, loggedInUser });
    } catch (error) {
        next(error);
    }
}

exports.filterByCategory = async (req, res, next) => {
    try {
        let isUserLoggedIn = false;
        let loggedInUser = '';
        const category = req.params.category;
        const products = await Products.find({ category });
        const count = await cartProductsCount(req);
        if(req.session.user) {
            isUserLoggedIn = true;
            loggedInUser = req.session.user.name;
        }
        res.render('products/category-filter', { products, category, count, isUserLoggedIn, loggedInUser });
    } catch (error) {
        next(error);
    }
}

exports.filterByModel = async (req, res, next) => {
    try {
        let isUserLoggedIn = false;
        let loggedInUser = '';
        const category = req.params.category;
        const model = req.params.model;
        const products = await Products.find({ model });
        const count = await cartProductsCount(req);
        if(req.session.user) {
            isUserLoggedIn = true;
            loggedInUser = req.session.user.name;
        }
        res.render('products/model-filter', { products, model, category, count, isUserLoggedIn, loggedInUser });
    } catch (error) {
        next(error);
    }
}
