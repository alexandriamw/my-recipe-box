// Dependencies
const express = require("express");
const path = require("path");
const expressHandlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;

// App-specific
const CONSTANTS = require("./helpers/constants");
const utils = require("./helpers/utils");

// Create a database pool
const pool = utils.createMysqlPool();

passport.use(new Strategy({
  usernameField: "email"
}, function (email, password, callback) {
  
}));

passport.serializeUser(function (user, callback) {
  // callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
  
});

// Init express app
const app = express();
app.engine("handlebars", expressHandlebars());
app.set("view engine", "handlebars");

// Static content paths
app.use("/js", express.static(path.resolve(process.cwd(), "public", "js")));
app.use("/css", express.static(path.resolve(process.cwd(), "public", "css")));
app.use("/images", express.static(path.resolve(process.cwd(), "public", "images")));

app.use(cookieParser());
app.use(session({
  cookie: {
    path: "/",
    httpOnly: false,
    secure: CONSTANTS.IS_PRODUCTION,
    maxAge: null
  },
  resave: false,
  saveUninitialized: false,
  secret: CONSTANTS.SESSION_SECRET
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(flash());

// Initialize passport and restore authentication state.
app.use(passport.initialize());
app.use(passport.session());

// Start server
const port = CONSTANTS.IS_PRODUCTION ? "80" : "8080";

app.listen(port, function () {
  app.get("/", function (req, res) {
    res.render("home");
  });

  app.get("/register", function(req, res) {
    res.render("register");
  })
});


