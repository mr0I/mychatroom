const Router = require('express').Router;
const router = Router();
const { pageLimiter } = require('../../helpers/limiter');
const { check, validationResult } = require('express-validator');
const User = require('../../rpc/models/User');
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const { checkAuth , isGuest } = require('../../helpers/middlewares');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const EventEmitter = require('events').EventEmitter;
const myEmitter = new EventEmitter();

const registerValidation = [
    check('name').notEmpty().withMessage('نام را پر کنید!'),
    check('email').notEmpty().withMessage('ایمیل را پر کنید!'),
    check('email').isEmail().withMessage('ایمیل معتبر نیست!'),
    check('password').notEmpty().withMessage('پسورد را پر کنید!'),
];

router.get('/success' ,pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/success');
}));
router.get('/',checkAuth ,pageLimiter, asyncErrorRenderer(async (req, res) => {
    const user = req.user;
    res.render('site/chat',{user:user});
}));
router.get('/auth',isGuest ,pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/auth',{
        succeed_login_msg: req.flash('success') ,
        failed_login_msg : req.flash('error'),
        user: req.user
    });
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

router.post('/getUName',asyncErrorHandler(async (req,res) => {
    const email = req.body.email;

    User.getUserByEmail(email, function (err, user) {
        if (err) throw err;
        if (user === null || user === undefined) return res.status(401).json({'success':false,'msg':'User Not Found'});

        res.status(200).json({'success':true,'msg':user.name});
    });

}));

router.post('/login', passport.authenticate(
    'local',{failureRedirect:'/auth', failureFlash: 'invalid Password!', session: true},null) ,
    asyncErrorHandler(async (req, res) => {
        res.redirect('/');
    }));

router.get('/logout', function (req, res) {
    const name = req.user.name;
    //console.log(name);

    myEmitter.emit('leave_message',name);

    // io.on('connection' , (socket) => {
    //     socket.broadcast.emit('leave_message', name + ' has left!');
    //     console.log(socket);
    // });
    //return;

    req.logout(function(err) {
        if (err) return next(err);
        else {

        res.redirect('/auth');
        }
    });
});


router.get('/auth/google',
    passport.authenticate('google', { scope : ['email'] } , null));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' } , null),
    asyncErrorHandler(async (req, res) =>{
        // Successful Authentication
        const user = req.user;
        const findUser = await User.getUserByGoogleID(user.id);
        const duplicateEntry = await User.findOne({email:user.emails[0].value} );

        if (findUser){
            req.login(findUser, function (err) {
                if (err) {
                    req.flash('error' , 'invalid!!!');
                    res.redirect('/auth');
                }
                else res.redirect('/');
            })
        } else if (duplicateEntry) {
            req.login(duplicateEntry, function (err) {
                if (err) {
                    req.flash('error' , 'invalid!!!');
                    res.redirect('/auth');
                }
                else res.redirect('/');
            });

        } else {
            const newUser = new User({
                name: user.displayName ??  (user.emails[0].value).split('@')[0],
                email: user.emails[0].value,
                password: Buffer.from('123456dummy', 'utf8').toString('base64'),
                google_id: user.id,
            });
            User.createUser(newUser , function (err,user) {
                if (err) {
                    req.flash('error' , 'invalid!!!');
                    res.redirect('/auth');
                }
                req.login(newUser, function (err) {
                    if (err) throw err;
                    else res.redirect('/');
                })
            });
        }
    }));


module.exports = router;