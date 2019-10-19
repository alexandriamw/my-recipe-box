// Built-ins and vendors
const bcrypt = require("bcrypt");
const mysql = require("mysql");

// App-specific
const CONSTANTS = require("./constants");

module.exports = {
  hashItem: function (plaintextItem) {
    return bcrypt.hash(plaintextItem, CONSTANTS.SALT_ROUNDS).then(function (hash) {
      return hash;
    }).catch(function (error) {
      throw error;
    });
  },
  compareItem: function (plaintextItem, hashedItem) {
    return bcrypt.compare(plaintextItem, hashedItem).then(function (result) {
      return result
    }).catch(function (error) {
      throw error;
    });
  },
  createMysqlPool: function () {
    try {
      return mysql.createPool({
        connectionLimit: CONSTANTS.MYSQL_CONNECTION_LIMIT,
        host: CONSTANTS.MYSQL_HOST,
        user: CONSTANTS.MYSQL_USER,
        password: CONSTANTS.MYSQL_PASS,
        database: CONSTANTS.MYSQL_DB,
        // port: 8889,
        insecureAuth: !CONSTANTS.IS_PRODUCTION,
        ssl: {
          rejectUnauthorized: CONSTANTS.IS_PRODUCTION
        },
        flags: {
          SECURE_CONNECTION: CONSTANTS.IS_PRODUCTION
        }
      });
    } catch (error) {
      throw error;
    }
  },
  query: function (connection, sql, params) {
    return new Promise(function (resolve, reject) {
      connection.query(sql, params, function (error, results) {
        if (error) {
          reject(error);
        }

        resolve(results);
      });
    });
  }
};
