const str = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const utils = {
  getRandomSymbol: () => str[Math.floor(Math.random() * str.length)],
  genString: (length) => new Array(length).fill(0).map(utils.getRandomSymbol).join(''),
  withErrLog: (cb = () => {}) => (err, ...data) => {
    if (err) {
      console.log('error: ', err);
    } else {
      cb(...data);
    }
  },
  excludeKeys: (obj, keysArr) =>
    Object.entries(obj).reduce(
      (acc, [key, val]) => ({
        ...acc,
        ...(keysArr.some((k) => k === key) ? {} : { [key]: val }),
      }),
      {},
    ),
  excludeItems: (arr, itemsArr) => arr.filter((item) => !itemsArr.some((it) => it === item)),
  makeSendBack: (socket) => (err, type, data) => {
    if (err) {
      console.log(err);
    } else {
      socket.emit(type, data);
    }
  },
  makeSendAll: (io) => (err, type, data) => {
    if (err) {
      console.log(err);
    } else {
      io.sockets.emit(type, data);
    }
  },
  makeSendTo: (io, connectedUsers) => (err, userId, type, data) => {
    if (err) {
      console.log(err);
    } else if (connectedUsers[userId]) {
      io.to(userId).emit(type, data);
    }
  },
  updateValByKeyOfObj: (obj) => (key, val) => {
    // eslint-disable-next-line no-param-reassign
    obj[key] = {
      ...(obj[key] || []),
      ...val,
    };
  },
};

module.exports = utils;
