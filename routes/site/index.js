const Router = require('express').Router,
    router = Router(),
    { pageLimiter } = require('../../helpers/limiter'),
    config = require('../../config'),
{createClient} = require('redis');


router.get('/one', pageLimiter, asyncErrorRenderer(async (req, res) => {
    res.send('one');
}));
// router.get('/two', pageLimiter, asyncErrorRenderer(async (req, res) => {
//     const subscriber = client.duplicate();
//     await subscriber.connect();
// }));

module.exports = router;