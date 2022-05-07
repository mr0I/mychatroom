const Router = require('express').Router;
const router = Router();
const { pageLimiter } = require('../../helpers/limiter');


router.get('/one', pageLimiter, asyncErrorRenderer(async (req, res) => {
    await global.client.incr('REDIS_KEY');

    res.send("<html><head><title>Page" +
        "</title><head><body><h1>Our Redis and Express Web Application</h1>" +
        "Redis count: " + await client.get('REDIS_KEY') + "</body></html>");
    res.end();
}));

module.exports = router;