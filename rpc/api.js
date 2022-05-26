const {apiLimiter} = require('../helpers/limiter');

// api router will mount other routers
module.exports = (app) => {
    app.use('/', apiLimiter,require('../routes/site/index'));
};