"user strict";
let mysql = require("mysql2");
const config = require("config");
const util = require("util");

function makeDb() {
  let configArray = {
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER_NAME,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
  };

  const connection = mysql.createConnection(configArray);
  return {
    connection,
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
    escape(val) {
      return connection.escape(val);
    },
  };
}

module.exports = { makeDb };
