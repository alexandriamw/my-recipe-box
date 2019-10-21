module.exports = {
  MYSQL_HOST: process.env.NODE_ENV === "production" ? process.env.MYSQL_HOST : "127.0.0.1",
  MYSQL_USER: process.env.NODE_ENV === "production" ? process.env.MYSQL_USER : "root",
  MYSQL_PASS: process.env.NODE_ENV === "production" ? process.env.MYSQL_PASS : "ae1b777",
  MYSQL_DB: "my_recipe_box",
  MYSQL_CONNECTION_LIMIT: 10,
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  SALT_ROUNDS: 10,
  SESSION_SECRET: process.env.NODE_ENV === "production" ? process.env.SESSION_SECRET : "it's a seeeeecret ooo"
};
