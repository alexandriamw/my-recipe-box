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
        port: 8889
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
  },
  html: function (htmlString) {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="an app to catalog your recipes" />
        <link rel="stylesheet" href="/css/reset.css">
        <link rel="stylesheet" href="/css/style.css">
        <link rel="stylesheet" href="/css/login.css">
        <link href="https://fonts.googleapis.com/css?family=Kalam&display=swap" rel="stylesheet">
        <title>My Recipe Box</title>
        </head>
        <body>
          <div class="content">
            <header>
              <h1 class="title">My Recipe Box</h1>
            </header>
            ${htmlString}
          </div>
          <footer class="footer">
            <p><img src="/images/cookie.png"> &copy; 2019 Alexandria Wagner</p>
          </footer>
        </body>
      </html>
    `;
  }
};
