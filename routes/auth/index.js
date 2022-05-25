const Router = require('express').Router;
const router = Router();
const { check, validationResult } = require('express-validator');
const User = require('../../rpc/models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const registerValiadation = [
    check('name').notEmpty().withMessage('نام را پر کنید!'),
    check('email').notEmpty().withMessage('ایمیل را پر کنید!'),
    check('email').isEmail().withMessage('ایمیل معتبر نیست!'),
    check('password').notEmpty().withMessage('پسورد را پر کنید!'),
];

router.post('/register' , registerValiadation,asyncErrorHandler(async (req, res) => {
    const {name,email,password} = req.body;
    console.log('req',req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Errors',errors.errors);
        res.render('site/auth', { 'errs': errors.errors });
    } else {
        console.log('No error');
        // var newUser = new User({
        //     name:name,
        //     username:username,
        //     email:email,
        //     password:password,
        //     profileimage:profileimage
        // });
        // User.createUser(newUser , function (err,user) {
        //     if (err) throw err;
        //     console.log(user);
        // });
        //
        // req.flash('success' , 'You register successfully.');
        // res.location('/');
        // res.redirect('/');
    }
}));


module.exports = router;


