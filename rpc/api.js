const {apiLimiter,} = require('../helpers/limiter');


// api router will mount other routers
module.exports = (app) => {
    app.use('/test' , require('../routes/site/index'));
};