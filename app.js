const express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server),
    config = require('./config'),
    session = require('express-session'),
    JSEncrypt = require('node-jsencrypt'),
    cmdArgs = require('yargs').argv,
    redis = require('./helpers/redis');


// Globals
global.isDev = cmdArgs['dev'];
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

app.get('*', function (req, res, next) {
    res.locals.currentUser  = req.user || null;
    next();
});

require('./rpc/middleware')(app,io); // setup the settings
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
    if(socket.request.session.email !== undefined){
        socket.emit('auth', socket.request.session.email);
    }

    //console.log('a user connected',socket.id);
    socket.on('chat_msg', (data) => {
        io.emit('chat_msg', data);
    });

    socket.on('auth', (email) => {
        console.log(email);
        socket.request.session.email = email;
        //socket.request.session.name = name;
        socket.request.session.save();
        socket.broadcast.emit('join_message', socket.request.session.name + ' has joined');
    });

    socket.on('disconnect', () => {
        // redis.client.get(socket.id)
        //     .then((user) => {
        //         if (user === null) return 'Someone';
        //         else return user;
        //     })
        //     .then((user) => {
        //         console.log(user + ' left');
        //         socket.broadcast.emit('user.events', user + ' left');
        //     }, errorEmit(socket));
    });
});


const hostname = '127.0.0.1';
server.listen(8080, hostname, () => {
    console.log(`server started: http://${hostname}:${8080}`);
});
// app.listen(process.argv[2] , () => {
//     console.log(`server started: http://${hostname}:${process.argv[2]}`);
// });
