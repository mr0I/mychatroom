const Router = require('express').Router,
    router = Router(),
    { pageLimiter } = require('../../helpers/limiter');


router.get('/', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.render('main');
}));


module.exports = router;