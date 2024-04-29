let session = require('express-session');
require('dotenv').config();

exports.userSession = session({
    name: 'bonstay-cart',
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: true
});