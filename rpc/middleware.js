const Express = require('express');
const compression = require('compression');
const path = require('path');
const favicon = require('serve-favicon');

// setup global middleware here
module.exports = (app) => {
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(Express.static(path.join(__dirname,'..','static')));
    app.use(favicon(path.join(__dirname,'..', 'static', 'favicon.ico')));
    app.use(compression()); // Compress all routes
};