const express = require('express');
const ioLib = require('socket.io');
const path = require('path');


const app = express();
const PORT = 3000;
var server = app.listen(PORT, function () {
  console.log('Server listening on port ' + PORT + '!');
});

// socket.io
const io = ioLib(server);

// views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('layout');
});

const connectedUsers = {};

const str = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const getRandomSymbol = () => str[Math.floor(Math.random() * str.length)];
const genString = length => new Array(length).fill(0).map(getRandomSymbol).join('');

/** Socket listeners **/
io.on('connection', socket => {
  /** Common functions **/
  // send response only to requested client
  function sendBack(err, type, data) {
    if (err) {
      console.log(err);
    }
    else {
      socket.emit(type, data);
    }
  }

  // send response to all connected clients
  function sendAll(err, type, data) {
    if (err) {
      console.log(err);
    }
    else {
      io.sockets.emit(type, data);
    }
  }

  // send response to specified client
  function sendTo(err, data, type, userId) {
    if (err) {
      console.log(err);
    }
    else {
      if(connectedUsers[userId]){
        io.to(sockeId).emit(type, data);
      }
    }
  }







  const userId = socket.id;
  connectedUsers[userId] = { name: 'Anonymus', hash: userId };
  sendBack(null, 'change_username', connectedUsers[userId]);
  const updateUserslist = () => {
    sendAll(null, "update_userslist", {clients: Object.values(connectedUsers).map(({name})=>name)});
  };
  updateUserslist();
  console.log(`client ${userId} connected`);


  //listen on change_username
  socket.on('change_username', data => {
    socket.username = data.name;
    connectedUsers[data.hash] = {...data};
    sendBack(null, 'change_username', connectedUsers[userId]);
    updateUserslist();
  });


  socket.on('disconnect', () => {
    if (connectedUsers[userId]) {
      delete connectedUsers[userId];
      updateUserslist();
    }
  });
});