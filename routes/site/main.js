const Router = require('express').Router,
    router = Router(),
    { pageLimiter } = require('../../helpers/limiter');


router.get('/', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/chat');
}));
router.get('/login', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/auth');
}));


module.exports = router;