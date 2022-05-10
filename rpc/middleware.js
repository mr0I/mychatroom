const Express = require('express');
const compression = require('compression');

// setup global middleware here
module.exports = (app) => {
    app.use(Express.json());
    app.use(Express.urlencoded({ extended: true }));
    app.use(compression()); // Compress all routes
};