const { getDbUserData, updateDbUserName, registerDbUser } = require('./sqlMiddleware');
const {
  withErrLog,
  excludeKeys,
  excludeItems,
  makeSendBack,
  makeSendAll,
  makeSendTo,
  updateValByKeyOfObj,
} = require('./utils');

const connectedUsers = {};
const battlesData = {};

const updateUserInfo = updateValByKeyOfObj(connectedUsers);
const updateBattleCommonData = updateValByKeyOfObj(battlesData);

const socketListeners = (io, socket) => {
  /** Common functions * */
  // send response only to requested client
  const sendBack = makeSendBack(socket);
  // send response to all connected clients
  // eslint-disable-next-line no-unused-vars
  const sendAll = makeSendAll(io);
  // send response to specified client
  const sendTo = makeSendTo(io, connectedUsers);

  const socketId = socket.id;
  // for in-listener usage
  let user = connectedUsers[socketId];

  const syncConnectedUserLocalInfo = () => {
    user = excludeKeys(connectedUsers[socketId], [
      'id',
      'incomingInvites',
      'outcomingInvites',
      'incomingInvitesRejected',
    ]);
  };

  const updateConnectedUserInfo = (info) => {
    updateUserInfo(socketId, info);
    syncConnectedUserLocalInfo();
  };

  const initialUser = {
    name: 'Anonymous',
    hash: socketId,
    isLoggedIn: false,
    email: '',
    password: '',
    incomingInvites: [],
    incomingInvitesRejected: [],
    outcomingInvites: [],
    isInBattle: false,
  };

  const resetConnectedUserInfo = () =>
    updateConnectedUserInfo({
      ...initialUser,
    });

  resetConnectedUserInfo();

  const updateUsersList = () => {
    Object.keys(connectedUsers).forEach((userId) => {
      sendTo(null, userId, 'update_userslist', {
        clients: Object.values(connectedUsers).map(
          ({
            incomingInvites,
            outcomingInvites,
            incomingInvitesRejected,
            email,
            password,
            ...rest
          }) => ({
            invited: incomingInvites.some((userHash) => userHash === userId),
            invites: outcomingInvites.some((userHash) => userHash === userId),
            rejected: incomingInvitesRejected.some((userHash) => userHash === userId),
            ...(rest.hash === userId && { email, password }),
            ...rest,
          }),
        ),
      });
    });
  };

  const loginOnServer = (dbUserData, password, error = 'Error in Email or Password') => {
    console.log('LoggedIn', JSON.stringify(dbUserData, null, 2));
    if (dbUserData.password === password) {
      updateConnectedUserInfo({
        ...dbUserData,
        isLoggedIn: true,
      });
      updateUsersList();
      sendBack(null, 'update_user', user);
    } else {
      sendBack(null, 'update_user', {
        error,
      });
    }
  };

  const registerOnServer = ({ name, email, password }) => {
    registerDbUser(
      { name, email, password },
      withErrLog(() => {
        getDbUserData(
          { email },
          withErrLog(([dbUserData]) => {
            if (dbUserData) {
              loginOnServer(dbUserData, password, 'Err on registration');
            }
            console.log('Registered', JSON.stringify(user, null, 2));
            sendBack(null, 'update_user', { error: 'Err on registration' });
          }),
        );
      }),
    );
  };

  sendBack(null, 'update_user', user);
  updateUsersList();
  console.log(`Client ${socketId} connected`);

  // TODO: restore pass
  socket.on('login', ({ email, password }) => {
    getDbUserData(
      { email },
      withErrLog(([dbUserData]) => {
        if (dbUserData) {
          loginOnServer(dbUserData, password);
        } else {
          sendBack(null, 'update_user', { error: 'No user' });
        }
      }),
    );
  });

  socket.on('logout', () => {
    if (user.isLoggedIn) {
      resetConnectedUserInfo();
      sendBack(null, 'update_user', user);
      updateUsersList();
    }
  });

  socket.on('update_user', ({ name }) => {
    updateConnectedUserInfo({
      name,
    });
    if (user.isLoggedIn) {
      updateDbUserName(user, withErrLog());
    }
    sendBack(null, 'update_user', user);
    updateUsersList();
  });

  // login or register (only email is unique)
  socket.on('register_user', ({ name, email, password }) => {
    getDbUserData(
      { email },
      withErrLog(([dbUserData]) => {
        if (dbUserData) {
          loginOnServer(dbUserData, password, 'User Already Exists, Try to Login');
        } else {
          registerOnServer({ name, email, password });
        }
      }),
    );
  });

  socket.on('invite', ({ hash }) => {
    if (connectedUsers[hash]) {
      updateUserInfo(hash, {
        incomingInvites: [...connectedUsers[hash].incomingInvites, socketId],
        incomingInvitesRejected: excludeItems(connectedUsers[hash].incomingInvitesRejected, [
          socketId,
        ]),
      });
      updateConnectedUserInfo({
        outcomingInvites: [...connectedUsers[socketId].outcomingInvites, hash],
      });
      console.log('Invited', JSON.stringify(connectedUsers[socketId], null, 2));
      updateUsersList();
    }
  });

  socket.on('reject_invite', ({ hash }) => {
    if (connectedUsers[hash]) {
      updateUserInfo(hash, {
        outcomingInvites: excludeItems(connectedUsers[hash].outcomingInvites, [socketId]),
      });
      updateConnectedUserInfo({
        incomingInvites: excludeItems(connectedUsers[socketId].incomingInvites, [hash]),
        incomingInvitesRejected: [...connectedUsers[socketId].incomingInvitesRejected, hash],
      });

      console.log('Rejected', JSON.stringify(connectedUsers[socketId], null, 2));
      updateUsersList();
    }
  });

  // change socket hash to db userId in order to continue battle on reconnection
  socket.on('accept_invite', ({ hash }) => {
    if (connectedUsers[hash]) {
      updateUserInfo(hash, {
        isInBattle: true,
        outcomingInvites: excludeItems(connectedUsers[hash].outcomingInvites, [socketId]),
      });
      updateConnectedUserInfo({
        isInBattle: true,
        incomingInvites: excludeItems(connectedUsers[socketId].incomingInvites, [hash]),
        incomingInvitesRejected: excludeItems(connectedUsers[socketId].incomingInvitesRejected, [
          hash,
        ]),
      });
      updateBattleCommonData(hash, {
        partnerId: socketId,
        partnerName: connectedUsers[socketId].name,
      });
      updateBattleCommonData(socketId, {
        partnerId: hash,
        partnerName: connectedUsers[hash].name,
      });
      updateUsersList();
      console.log('Accept', JSON.stringify(connectedUsers[socketId], null, 2));
      sendTo(null, hash, 'start_battle', battlesData[hash]);
      sendBack(null, 'start_battle', battlesData[socketId]);
    }
  });

  socket.on('player_ready', ({ partnerId, field }) => {
    if (connectedUsers[partnerId]) {
      updateBattleCommonData(partnerId, {
        isPartnerReadyForBattle: true,
        showPartnerField: battlesData[partnerId].isReadyForBattle || false,
        partnerField: {
          ...field,
          active: field.active.filter((cellId) => field.checked.includes(cellId)),
        },
      });
      updateBattleCommonData(socketId, {
        isReadyForBattle: true,
        showPartnerField: battlesData[partnerId].isReadyForBattle || false,
        activeTurn: !battlesData[partnerId].isReadyForBattle,
        field,
      });
      console.log('Start battle', JSON.stringify(battlesData[socketId], null, 2));

      sendTo(null, partnerId, 'update_battle', battlesData[partnerId]);
      sendBack(null, 'update_battle', battlesData[socketId]);
    }
  });

  socket.on('player_turn', ({ partnerId, cell }) => {
    if (connectedUsers[partnerId] && battlesData[socketId]?.activeTurn) {
      const hit = battlesData[partnerId].field.active.includes(cell);
      updateBattleCommonData(partnerId, {
        activeTurn: !hit,
        field: {
          ...battlesData[partnerId].field,
          checked: [...battlesData[partnerId].field.checked, cell],
        },
      });

      const activePartnerFields = battlesData[partnerId].field.active.filter((cellId) =>
        battlesData[partnerId].field.checked.includes(cellId),
      );

      updateBattleCommonData(socketId, {
        activeTurn: hit,
        partnerField: {
          ...battlesData[partnerId].field,
          active: activePartnerFields,
        },
      });

      if (activePartnerFields.length === battlesData[partnerId].field.active.length) {
        sendTo(null, partnerId, 'update_battle', battlesData[partnerId]);
        sendTo(null, partnerId, 'end_battle', { winner: connectedUsers[socketId].name });
        sendBack(null, 'update_battle', battlesData[socketId]);
        sendBack(null, 'end_battle', { winner: connectedUsers[socketId].name });
        delete battlesData[socketId];
        delete battlesData[partnerId];
        updateUserInfo(partnerId, {
          isInBattle: false,
        });
        updateConnectedUserInfo({
          isInBattle: false,
        });
        updateUsersList();
      } else {
        sendTo(null, partnerId, 'update_battle', battlesData[partnerId]);
        sendBack(null, 'update_battle', battlesData[socketId]);
      }
    }
  });

  socket.on('disconnect', () => {
    if (connectedUsers[socketId]) {
      delete connectedUsers[socketId];
      delete battlesData[socketId];
      user = null;
      updateUsersList();
    }
  });
};

module.exports = socketListeners;
