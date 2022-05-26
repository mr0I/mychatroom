const Express = require('express');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon');
const session = require('express-session');
const flash = require('connect-flash');


// setup global middleware here
module.exports = (app,io) => {
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(Express.static(path.join(__dirname,'..','static')));
    app.use(favicon(path.join(__dirname,'..', 'static', 'favicon.ico')));
    const sessionMiddleware = session({
        secret: 'nGnuPrT2UQhTik7H',
        resave: false,
        saveUninitialized: true,
        cookie:{
            maxAge: 8.64e+7 // milliseconds
        }
    });
    app.use(sessionMiddleware);
    app.use((req, res, next) => {
        // console.log(`From Express: ${req.session.email}`);
        next();
    });
    io.use((socket, next) => {sessionMiddleware(socket.request, {}, next);});
    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });
    app.use(compression()); // Compress all routes
};