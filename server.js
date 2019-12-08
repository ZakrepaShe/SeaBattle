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

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/lobby', (req, res) => {
  res.render('index');
});

const str = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const getRandomSymbol = () => str[Math.floor(Math.random() * str.length)];
// eslint-disable-next-line no-unused-vars
const genString = length =>
  new Array(length)
    .fill(0)
    .map(getRandomSymbol)
    .join('');

/** Socket listeners * */
io.on('connection', socket => {
  socketListeners(io, socket);
});
