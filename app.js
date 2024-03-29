const express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    { Server } = require("socket.io"),
    io = new Server(server),
    mongoose = require('mongoose');
    cmdArgs = require('yargs').argv;
    require('dotenv').config();


// connect Mongoose to your DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/socket-db');


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


app.set('socketio', io);
require('./rpc/middleware')(app,io); // setup the settings
require('./rpc/api')(app); // setup the api
require('./rpc/settings')(app); // setup the settings


// socket
io.on('connection', (socket) => {
    if(socket.request.session.name !== undefined){
        socket.emit('auth', socket.request.session.name);
    }

    //console.log('a user connected',socket.id);
    socket.on('chat_msg', (data) => {
        io.emit('chat_msg', data);
    });

    socket.on('auth', (name) => {
        socket.request.session.name = name;
        socket.request.session.save();
        socket.broadcast.emit('join_message', name + ' has joined');
    });
});


const port = (isDev) ? 8080 : process.env.PORT;
const hostname = (isDev) ? '127.0.0.1' : '0.0.0.0';
server.listen(port, hostname, () => {
    console.log(`server started: http://${hostname}:${port}`);
});