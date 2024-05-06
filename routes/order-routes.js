const express = require('express');
const Controller = require('../controller/order-controller');
const router = express.Router();

router.get('/', Controller.orderDetails);

router.post('/', Controller.orderDetails);


module.exports = router;