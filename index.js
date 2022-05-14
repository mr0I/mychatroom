const express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server),
    config = require('./config'),
    redis = require('./helpers/redis');


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
            res.status(500).render('error_pages/error', {
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

require('./rpc/middleware')(app); // setup the settings
require('./rpc/api')(app); // setup the api
require('./rpc/settings')(app); // setup the settings

// socket
const errorEmit = (socket) => {
    return (err) => {
        console.log(err);
        socket.broadcast.emit('user.events', 'Something went wrong!');
    };
};
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user.events','Someone has joined!');

    socket.on('chat_msg', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat_msg', msg);
    });

    socket.on('auth', (email) => {
        redis.client.set(socket.id,email,{
            EX:Number(config.redis_expire),
            NX: true // Only set the key if it does not already exist
        }).then(() => {
            console.log(email + ' logged in.');
            socket.broadcast.emit('auth', email);
        },errorEmit(socket));
    });

    socket.on('disconnect', () => {
        redis.client.get(socket.id)
            .then((user) => {
                if (user === null) return 'Someone';
                else return user;
            })
            .then((user) => {
                console.log(user + ' left');
                socket.broadcast.emit('user.events', user + ' left');
            }, errorEmit(socket));
    });
});


const hostname = '127.0.0.1';
server.listen(8080, hostname, () => {
    console.log(`server started: http://${hostname}:${8080}`);
});
// app.listen(process.argv[2] , () => {
//     console.log(`server started: http://${hostname}:${process.argv[2]}`);
// });
