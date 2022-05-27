const Express = require('express');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const BodyParser = require('body-parser');
const session = require('express-session');
require('../helpers/passport')(passport);


// Setup Global Middleware Here
module.exports = (app,io) => {
    app.use(BodyParser.json({ limit: '10mb' }));
    app.use(BodyParser.urlencoded({ extended: false }));
    const sessionMiddleware = session({
        secret: 'nGnuPrT2UQhTik7H',
        resave: true,
        saveUninitialized: true,
        // cookie:{
        //     maxAge: 8.64e+7 // milliseconds
        // },
        cookie:{path:'/',maxAge: 30 * 60 * 1000} // 30 minutes
    });
    app.use(sessionMiddleware);
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(Express.static(path.join(__dirname,'..','static')));
    app.use(favicon(path.join(__dirname,'..', 'static', 'favicon.ico')));
    app.use(flash());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });
    io.use((socket, next) => {sessionMiddleware(socket.request, {}, next);});
    app.use(compression()); // Compress all routes
};