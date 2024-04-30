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

function filterProducts(allProducts, filter) {
    return allProducts.filter(p => p.category.toLowerCase() === filter.toLowerCase());
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const search = req.query.search;
        const category = req.query.category;
        const model = req.query.model;
        let isUserLoggedIn = false;
        let loggedInUser = '';
        let products = await Products.find({});
        const count = await cartProductsCount(req, res);

        if(category) { products = filterProducts(products, category);}
        if(search) { products = products.filter(p.name.toLowerCase().includes(quert.toLowerCase())); }
        if(req.session.user) {
            isUserLoggedIn = true;
            loggedInUser = req.session.user.name;
        }
        res.render('products/all-products', { category, model, products, count, isUserLoggedIn, loggedInUser });
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
