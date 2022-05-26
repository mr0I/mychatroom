const Express = require('express');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const BodyParser = require('body-parser');
let session = require('express-session');


// setup global middleware here
module.exports = (app,io) => {
    app.use(BodyParser.json({ limit: '10mb' }));
    app.use(BodyParser.urlencoded({ extended: false }));
    app.use(session({
            secret: 'z3ORmOwWQ9',
            resave: false,
            saveUninitialized:true,
            cookie:{path:'/',maxAge: 30 * 60 * 1000} // 30 minutes
        }
    ));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(Express.static(path.join(__dirname,'..','static')));
    app.use(favicon(path.join(__dirname,'..', 'static', 'favicon.ico')));
    app.use(flash());
    app.use((req, res, next) => {
        res.locals.success_message = req.flash('success_message');
        res.locals.error_message = req.flash('error_message');
        res.locals.error = req.flash('error');
        next();
    });
    // app.use((req, res, next) => {
    //     // console.log(`From Express: ${req.session.email}`);
    //     next();
    // });
    io.use((socket, next) => {sessionMiddleware(socket.request, {}, next);});
    // app.use(function (req, res, next) {
    //     res.locals.messages = require('express-messages')(req, res);
    //     next();
    // });
    app.use(compression()); // Compress all routes
};