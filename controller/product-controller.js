const Products = require('../models/products');
const User = require('../models/user');

const cartProductsCount = async function(req) {
    let user = req.session.user;
    if(user) {
        const cartProducts = await User.findOne({ email: user.email });
        return cartProducts.carts.length;
    }
    return 0;
}

function filterProductsByCategory(allProducts, filter) {
    return allProducts.filter(p => p.category.toLowerCase() === filter.toLowerCase());
}

exports.getAllProducts = async (req, res, next) => {
    try {
        
        const { search, category, model } = req.query;
        const user = req.session.user;

        var productAddedToCart = false;
        if (user) {
            if(!user.addedToCart ) {
                user.addedToCart = false;
            } else {
                user.addedToCart = true;
                delete user.addedToCart;
                productAddedToCart = true;
            }
            delete user.currentOpenedProduct;
            delete user.fromCart;
        }

        console.log(req.session);
        
        let isUserLoggedIn = !!req.session.user;
        let loggedInUser = req.session.user ? req.session.user.name : '';

        let products = await Products.find({});

        if (category) {
            products = filterProductsByCategory(products, category);
        }
        if (model) {
            products = products.filter(p => p.model.toLowerCase() === model.toLowerCase());
        }
        if (search) {
            products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        // console.log(req.session);
        const count = await cartProductsCount(req);
        res.render('products/all-products', { category, model, products, count, isUserLoggedIn, loggedInUser, productAddedToCart });
    } catch (error) {
        next(error);
    }
}


exports.getProductById = async (req, res, next) => {
    try {
        let isUserLoggedIn = false;
        let loggedInUser = '';
        const id = req.params.id;
        let user = req.session.user;
        const product = await Products.findOne({ productId: id });
        if(user) {
            isUserLoggedIn = true;
            loggedInUser = req.session.user.name;
            user.currentOpenedProduct = id;
        }
        // console.log(req.session);
        const count = await cartProductsCount(req);
        res.render('products/view-product', { product, isUserLoggedIn, count, loggedInUser });
    } catch (error) {
        next(error);
    }
}
