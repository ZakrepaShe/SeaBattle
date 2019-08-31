const db = require('./mySqlConnection');

const sqlMids = {
  getDbUserData: ({ email, password }, cb) => {
    db.query(
      'SELECT * FROM `userdata` WHERE `email` = ? AND `password` = ?',
      [email, password],
      cb
    );
  },
  updateDbUserName: ({ name, email }, cb) => {
    db.query(
      'UPDATE userdata SET `name` = ? WHERE `email` = ?',
      [name, email],
      cb
    );
  },
  registerDbUser: ({ name, email, password }, cb) => {
    db.query(
      'INSERT INTO userdata (name,email,password) VALUES (?,?,?)',
      [name, email, password],
      cb
    );
  }
};

module.exports = sqlMids;
