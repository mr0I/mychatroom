const Router = require('express').Router,
    router = Router(),
    { pageLimiter } = require('../../helpers/limiter');


router.get('/', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('main');
}));
router.get('/login', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('login');
}));


module.exports = router;