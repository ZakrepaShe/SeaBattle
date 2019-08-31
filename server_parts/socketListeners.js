const { getDbUserData, updateDbUserName } = require('./sqlMiddleware');

const connectedUsers = {};

const socketListeners = (io, socket) => {
  /** Common functions * */
  // send response only to requested client
  function sendBack(err, type, data) {
    if (err) {
      console.log(err);
    } else {
      socket.emit(type, data);
    }
  }

  // send response to all connected clients
  function sendAll(err, type, data) {
    if (err) {
      console.log(err);
    } else {
      io.sockets.emit(type, data);
    }
  }

  // send response to specified client
  // eslint-disable-next-line no-unused-vars
  function sendTo(err, data, type, userId) {
    if (err) {
      console.log(err);
    } else if (connectedUsers[userId]) {
      io.to(userId).emit(type, data);
    }
  }

  const socketId = socket.id;
  const initialUser = {
    name: 'Anonymus',
    hash: socketId,
    isLoggedIn: false,
    email: null,
    password: null
  };

  connectedUsers[socketId] = {
    ...initialUser
  };

  const updateUserslist = () => {
    sendAll(null, 'update_userslist', {
      clients: Object.values(connectedUsers).map(({ name }) => name)
    });
  };

  sendBack(null, 'update_user', connectedUsers[socketId]);
  updateUserslist();
  console.log(`client ${socketId} connected`);

  socket.on('login', ({ email, password }) => {
    getDbUserData({ email, password }, (err, res) => {
      if (err) {
        console.log('error: ', err);
      } else {
        if (res[0]) {
          connectedUsers[socketId] = {
            ...connectedUsers[socketId],
            ...res[0],
            isLoggedIn: true
          };
          updateUserslist();
        }
        sendBack(
          null,
          'update_user',
          res[0] ? connectedUsers[socketId] : { error: 'No user' }
        );
      }
    });
  });

  socket.on('logout', () => {
    if (connectedUsers[socketId]) {
      connectedUsers[socketId] = {
        ...initialUser
      };
      sendBack(null, 'update_user', connectedUsers[socketId]);
      updateUserslist();
    }
  });

  socket.on('update_user', ({ name }) => {
    connectedUsers[socketId] = {
      ...connectedUsers[socketId],
      name
    };
    if (connectedUsers[socketId].isLoggedIn) {
      updateDbUserName(connectedUsers[socketId], err => {
        if (err) {
          console.log('error: ', err);
        }
      });
    }
    sendBack(null, 'update_user', connectedUsers[socketId]);
    updateUserslist();
  });

  socket.on('disconnect', () => {
    if (connectedUsers[socketId]) {
      delete connectedUsers[socketId];
      updateUserslist();
    }
  });
};

module.exports = socketListeners;
