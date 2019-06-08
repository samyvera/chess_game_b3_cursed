const express = require('express');
const app = express();
const http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('../config');
var util = require('./lib/util');
var User = require('./lib/user');

app.use(express.static(__dirname + '/../client'));

var sockets = new Map();
var users = new Map();
var rooms = [];

io.on('connection', socket => {
    var user = new User(socket.id);
    console.log('Connection : ' + socket.id);

    socket.on('join', name => {
        if (users.has(user.id) || !util.validName(name)) socket.disconnect();
        else {
            sockets.set(user.id, socket);
            users.set(user.id, user);
            user.name = name;
            socket.emit('welcome');
            updateGlobalInfos();
            console.log('Join : ' + socket.id + ' as "' + name + '"');
        }
    });

    socket.on('createRoom', name => {
        if (user.room || !util.validName(name)) socket.disconnect();
        else {
            rooms.push(name);
            user.room = name;
            updateGlobalInfos();
            console.log('Create Room : ' + user.name + ' created room "' + name + '"');
        }
    });

    socket.on('joinRoom', name => {
        if (user.room || !rooms.includes(name)) socket.disconnect();
        else {
            user.room = name;
            updateGlobalInfos();
            console.log('Join Room : ' + user.name + ' joined ' + name);
        }
    });

    socket.on('leaveRoom', name => {
        if (!user.room || !rooms.includes(name)) socket.disconnect();
        else {
            user.room = null;
            updateGlobalInfos();
            console.log('Leave Room : ' + user.name + ' leaved ' + name);
        }
    });

    socket.on('disconnect', () => {
        if (users.has(user.id)) users.delete(user.id);
        updateGlobalInfos();
        console.log('Disconnect : ' + socket.id);
    });
});

var updateGlobalInfos = () => {
    var data = [];
    users.forEach(user => {
        data.push({
            name:user.name,
            room:user.room
        });
    });
    users.forEach(user => {
        var roomData = [];
        if (user.room) {
            users.forEach(user2 => {
                if (user2.room === user.room) roomData.push(user2.name);
            });
        }
        sockets.get(user.id).emit('globalInfos', data, roomData);
    });
}

http.listen(process.env.PORT || config.port);