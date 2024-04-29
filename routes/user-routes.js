const express = require('express');
const Controller = require('../controller/user-controller');
const router = express.Router();

router.get('/login', Controller.getLogin);

router.post('/login', Controller.login);

router.get('/register', Controller.getRegister)

router.post('/register', Controller.signup);

router.get('/logout', Controller.logout);

module.exports = router;