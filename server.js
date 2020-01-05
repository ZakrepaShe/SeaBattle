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
const io = ioLib(server);

// views
app.set('views', path.join(__dirname, 'dist'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.render('index');
});

/** Socket listeners */
io.on('connection', socket => {
  socketListeners(io, socket);
});
