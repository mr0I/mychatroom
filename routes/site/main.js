const Router = require('express').Router,
    router = Router(),
    config = require('../../config'),
    { pageLimiter } = require('../../helpers/limiter');


router.get('/', pageLimiter, asyncErrorRenderer(async (req, res) => {
    const privateKey = config.OPENSSL_PRIVATE_KEY;
    res.render('site/chat' , {pk:privateKey});
}));
router.get('/login', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/auth');
}));


module.exports = router;