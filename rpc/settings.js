const path = require('path');

module.exports = (app) => {
    app.disable('x-powered-by');
    app.set('view engine', 'ejs');
    app.set('views', [path.join(__dirname, '../views')]);
    app.get('*', (req, res) => {
        res.status(404).render('error_pages/404', {
            error: {
                message: 'صفحه یافت نشد',
                stack: '',
            }
        });
    });    // app.get('/robots.txt', require('./routes/robots/index'));
    // app.disable('view cache');
};