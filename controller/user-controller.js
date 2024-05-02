const User = require('../models/user');

exports.getLogin = async (req, res, next) => {
    try {
        if(req.session.user) {
            return res.redirect('/products');
        }
        res.render('user/login');
    } catch (error) {
        next(error);
    }
}

exports.getRegister = async (req, res, next) => {
    try {
        if(req.session.user) {
            return res.redirect('/products');
        }
        res.render('user/register');
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const fetchUser = await User.findOne({ email });
        req.session.user = {
            name: fetchUser.name,
            email: fetchUser.email,
        };
        res.redirect('/products');
    } catch (error) {
        next(error);
    }
}

exports.signup = async (req, res, next) => {
    try {
        const user = req.body;
        const newUser = await User.create(user);
        req.session.user = {
            name: newUser.name,
            email: newUser.email,
        };
        res.redirect('/products');
    } catch (error) {
        next(error);
    }
}

exports.logout = async (req, res, next) => {
    try {
        req.session.destroy();
        res.redirect('/products');
    } catch (error) {
        next(error);
    }
}

exports.profile = async (req, res, next) => {
    try {
        if(!req.session.user) { return res.redirect('/products');}
        const email = req.session.user.email;

        const user = await User.findOne({ email });

        res.render('user/profile', { user });
    } catch (error) {
        next(error);
    }
}