const express = require('express');
const ioLib = require('socket.io');
const path = require('path');

const socketListeners = require('./server_parts/socketListeners');

const app = express();
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

// socket.io
const io = ioLib(server, {
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
});

// views
app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'dist')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('*', (req, res) => {
  res.render('index');
});

/** Socket listeners */
io.on('connection', (socket) => {
  socketListeners(io, socket);
});
