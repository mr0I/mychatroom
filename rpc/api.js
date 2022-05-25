const {apiLimiter} = require('../helpers/limiter');

// api router will mount other routers
module.exports = (app) => {
    app.use('/', require('../routes/site/main'));
    app.use('/auth',apiLimiter, require('../routes/auth/index'));
};