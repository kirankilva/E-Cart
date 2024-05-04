const express = require('express');
const Controller = require('../controller/user-controller');
const Validation = require('../utilities/validations');
const router = express.Router();

router.get('/login', Controller.getLogin);

router.post('/login', Validation.loginValidation, Controller.login);

router.get('/register', Controller.getRegister)

router.post('/register', Validation.signupValidation, Controller.signup);

router.get('/logout', Controller.logout);

router.get('/user-profile', Controller.profile);

module.exports = router;