const Router = require('express').Router;
const router = Router();
const { pageLimiter } = require('../../helpers/limiter');
const { check, validationResult } = require('express-validator');
const User = require('../../rpc/models/User');
const passport = require('passport');
const { checkAuth , isGuest } = require('../../helpers/middlewares');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const registerValidation = [
    check('name').notEmpty().withMessage('نام را پر کنید!'),
    check('email').notEmpty().withMessage('ایمیل را پر کنید!'),
    check('email').isEmail().withMessage('ایمیل معتبر نیست!'),
    check('password').notEmpty().withMessage('پسورد را پر کنید!'),
];

router.get('/',checkAuth ,pageLimiter, asyncErrorRenderer(async (req, res) => {
    const user = req.user;
    res.render('site/chat',{name:user.name});
}));
router.get('/auth' ,pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/auth',{succeed_login_msg: req.flash('success') , failed_login_msg : req.flash('error')});
}));

router.post('/auth' , registerValidation,asyncErrorHandler(async (req, res) => {
    const {name,email,password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('site/auth', { 'errs': errors.errors });
    } else {
        const newUser = new User({
            name:name,
            email:email,
            password:password,
        });
        User.createUser(newUser , function (err,user) {
            if (err) throw err;
        });

        req.flash('success' , 'You register successfully.');
        res.redirect('/auth');
    }
}));
router.post('/login', passport.authenticate(
    'local',{failureRedirect:'/auth', failureFlash: 'invalid Password!', session: true}) ,
    asyncErrorHandler(async (req, res) => {
        const user = req.user;
        io.on('connection',(socket)=>{
            socket.request.session.name = user.name;
        });
        req.session.userName = user.name;

        res.redirect('/');
    }));
router.get('/logout', function (req, res) {
    req.logout(function(err) {
        if (err)  return next(err);
        res.redirect('/auth');
    });
});


module.exports = router;