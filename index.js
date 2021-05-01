const express = require('express');
const socket = require('socket.io');

const app = express();

var server = app.listen(4000, function () {
  console.log("server running");
});

app.use(express.static("public"));

var io = socket(server);
io.on('connection', function (socket) {
  console.log("User connected: " + socket.id);

  socket.on('join', function (roomName) {

    // will give us whole list of sockets/rooms
    var rooms = io.sockets.adapter.rooms;

    var room = rooms.get(roomName);  //get our curr room

    // if room doesnt exist, create
    if (room == undefined) {
      socket.join(roomName);
      socket.emit("created");
    }
    // if room has one person, join room
    else if (room.size == 1) {
      socket.join(roomName);
      socket.emit("joined");
    }
    // else means two users joined, full
    else {
      socket.emit("full");
    }

    console.log(rooms);
  });


  socket.on('ready', function (roomName) {
    console.log("ready");
    socket.broadcast.to(roomName).emit('ready');
  });

  socket.on('candidate', function (candidate, roomName) {
    console.log("candidate");
    socket.broadcast.to(roomName).emit('candidate', candidate);
  });

  socket.on('offer', function (offer, roomName) {
    console.log("offer");
    socket.broadcast.to(roomName).emit('offer', offer);
  });

  socket.on('answer', function (answer, roomName) {
    console.log("answer");
    socket.broadcast.to(roomName).emit('answer', answer);
  });

});
