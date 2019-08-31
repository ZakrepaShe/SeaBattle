const mysql = require('mysql');

const connection = mysql.createConnection(
  'mysql://root:password@localhost/default'
);

module.exports = connection;
