const express = require('express');
const Controller = require('../controller/product-controller');
const router = express.Router();

router.get('/', Controller.getAllProducts);

router.get('/search', Controller.searchProducts);

router.get('/category/:category', Controller.filterByCategory);

router.get('/category/:category/:model', Controller.filterByModel);

router.get('/not-found', Controller.notFound);

router.get('/:id', Controller.getProductById);


module.exports = router;