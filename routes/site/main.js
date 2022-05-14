const Router = require('express').Router,
    router = Router(),
    { pageLimiter } = require('../../helpers/limiter');


router.get('/', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/auth');
}));
router.get('/chat', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('site/chat');
}));


module.exports = router;