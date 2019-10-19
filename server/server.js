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
const validators = require("./helpers/validators");

// Queries
const registerSql = require("./queries/register");

// Database connection
const dbConnection = utils.createMysqlPool();

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
  });

  app.post("/register", function(req, res) {
    let clean = {};

    if(!validators.isValidEmail(req.body.email)) {
      res.render("registerpost", {
        message: "That's not a valid email address."
      });

      return;
    }

    clean.email = req.body.email;
    
    if(!validators.isValidPassword(req.body.password)) {
      res.render("registerpost", {
        message: "Please enter a password."
      });

      return;
    }

    utils.hashItem(req.body.password).then(function(hashedItem) {
      clean.password = hashedItem;
      const params = [clean.email, clean.password];

      utils.query(dbConnection, registerSql, params).then(function() {
        res.render("registerpost", {
          message: "User registered! You can now log in."
        });
      }).catch(function(error) {
        res.render("registerpost", {
          message: "Couldn't create user: " + error
        });
      })
    }).catch(function(error) {
      res.render("registerpost", {
        message: "Couldn't hash password."
      });
    });

    return;
  });
});


