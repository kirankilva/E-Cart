const express = require('express');
const userController = require('../controller/user-controller');
const cardController = require('../controller/card-controller');
const orderController = require('../controller/order-controller');
const Validation = require('../utilities/validations');
const router = express.Router();

router.get('/login', userController.getLogin);

router.post('/login', Validation.loginValidation, userController.login);

router.get('/register', userController.getRegister)

router.post('/register', Validation.signupValidation, userController.signup);

router.get('/logout', userController.logout);

router.get('/profile', userController.profile);

router.get('/cards', cardController.allCards);

router.get('/orders', orderController.myOrders);

module.exports = router;