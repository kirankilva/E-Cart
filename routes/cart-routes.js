const express = require('express');
const router = express.Router();
const Controller = require('../controller/cart-controller');

router.get('/', Controller.getCart);

router.post('/add', Controller.addToCart);

router.post('/delete', Controller.deleteFromCart);


module.exports = router;