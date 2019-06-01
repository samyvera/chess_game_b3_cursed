const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('../config');
var util = require('./lib/util');
var User = require('./lib/user');
var Room = require('./lib/room');

app.use(express.static(__dirname + '/../client'));

var sockets = new Map();
var users = new Map();

io.on('connection', socket => {
    var user = new User(socket.id);

    socket.on('join', name => {
        if (users.has(user.id) || !util.validName(name)) socket.disconnect();
        else {
            sockets.set(user.id, socket);
            users.set(user.id, user);
            user.name = name;
            
            var rooms = [];
            users.forEach(user => {
                if (user.room && user.isHost) rooms.push(user.room);
            })
            socket.emit('welcome', users.size, rooms);
        }
    });

    socket.on('requestRoomHosting', name => {
        if (!user.isHost) {
            user.isHost = true;
            user.room = new Room(user, name);
        }
    });

    socket.on('disconnect', () => {
        if (users.has(user.id)) users.delete(user.id);
    });
});

var updateOnline = () => users.forEach(user => {
    var rooms = [];
    users.forEach(user => {
        if (user.room && user.isHost) rooms.push(user.room);
    });
    sockets.get(user.id).emit('updateOnline', users.size, rooms);
});

setInterval(updateOnline, 1000);

http.listen(process.env.PORT || config.port);