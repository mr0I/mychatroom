// api router will mount other routers
module.exports = (app) => {
    app.use('/', require('../routes/site/main'));
};