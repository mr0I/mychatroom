const express = require('express'),
    app = express(),
    config = require('./config'),
    process = require('process'),
    { createClient }  = require('redis'),
    http = require('http'),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server);




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


require('./rpc/api')(app); // setup the api
require('./rpc/settings')(app); // setup the settings



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


const hostname = '127.0.0.1';
server.listen(8080, hostname, () => {
    console.log(`server started: http://${hostname}:${8080}`);
});
// app.listen(process.argv[2] , () => {
//     console.log(`server started: http://${hostname}:${process.argv[2]}`);
// });
