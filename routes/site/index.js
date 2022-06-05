const Router = require('express').Router;
const router = Router();
const { pageLimiter } = require('../../helpers/limiter');
const { check, validationResult } = require('express-validator');
const User = require('../../rpc/models/User');
const passport = require('passport');
const { checkAuth , isGuest } = require('../../helpers/middlewares');
const PubSub =require('../../helpers/pubsub');
const pub_sub = new PubSub('greeting');


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
        succeed_login_msg: (req.flash('success')) ?? {} ,
        failed_login_msg : (req.flash('error')) ?? {},
        user: req.user
    });
}));

router.post('/auth' , registerValidation,asyncErrorHandler(async (req, res) => {
    const {name,email,password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('site/auth',{
            errs: errors.errors,
            succeed_login_msg: (req.flash('success')) ?? {} ,
            failed_login_msg : (req.flash('error')) ?? {},
            user: req.user
        });
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
    const io = req.app.get('socketio');
    const name = req.user.name;
    io.emit('leave_message',name + ' has left!');

    req.logout(function(err) {
        if (err) return next(err);
        else res.redirect('/auth');
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


// Pub Sub Pattern
router.get('/call', (req, res) => {
    pub_sub.sub(res);
});
router.get('/trigger', (req, res) => {
    pub_sub.pub(res);
});


module.exports = router;