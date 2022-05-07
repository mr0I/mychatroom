const express = require('express'),
    app = express(),
    config = require('./config'),
    process = require('process'),
    { createClient }  = require('redis');


// globals
global.asyncErrorHandler = function (f) {
    return async (req, res, next) => {
        try {
            await f(req, res, next);
        } catch (e) {
            if (isDev) {
                res.status(500).send(e.message + "\n" + e.stack);
            } else {
                res.status(500).send(e.message);
            }
        }
    }
};
global.asyncErrorRenderer = function (f) {
    return async (req, res, next) => {
        try {
            await f(req, res, next);
        } catch (e) {
            res.status(500).render('pages/error', {
                error: e
            });
        }
    }
};
global.parseOffsetLimit = function (req) {
    const offset = Number.parseInt(req.query.offset || '0');
    const limit = Number.parseInt(req.query.limit || '20');
    return { offset, limit };
};
(async () =>{
    global.client = createClient(config.redis_port,config.redis_host);
    global.client.on('error', (err) => console.log('Redis Client Error', err));
    await global.client.connect();
}) ();


require('./rpc/api')(app); // setup the api
require('./rpc/settings')(app); // setup the settings


const port = 8080;
const hostname = '127.0.0.1';
app.listen(port, hostname, () => {
    console.log(`server started: http://${hostname}:${port}`);
});
//app.listen(process.argv[2]);
