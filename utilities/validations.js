const { check } = require('express-validator');

exports.loginValidation = [
    check('email').notEmpty().withMessage('email is required'),
    check('password').notEmpty().withMessage('password is required')
]

exports.signupValidation = [
    check('name').notEmpty().withMessage('name is required'),
    check('email').notEmpty().withMessage('email is required'),
    check('address').notEmpty().withMessage('address is required'),
    check('phone').notEmpty().withMessage('phone is required'),
    check('password').notEmpty().withMessage('password is required')
]