const express = require('express');
const Controller = require('../controller/product-controller');
const router = express.Router();

router.get('/', Controller.getAllProducts);

router.get('/:id', Controller.getProductById);


module.exports = router;