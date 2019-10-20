// Dependencies
const express = require("express");
const path = require("path");
const expressHandlebars = require("express-handlebars");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// App-specific
const CONSTANTS = require("./helpers/constants");
const utils = require("./helpers/utils");
const validators = require("./helpers/validators");

// Queries
const registerSql = require("./queries/register");
const getUserByEmailSql = require("./queries/getUserByEmail");
const getUserByIdSql = require("./queries/getUserById");

// Database connection
const dbConnection = utils.createMysqlPool();

passport.use(new LocalStrategy({
  usernameField: "email"
}, function (email, password, callback) {
  const params = [email];

  utils.query(dbConnection, getUserByEmailSql, params).then(function (results) {
    const user = results[0];

    if (!user) {
      return callback(null, false);
    }

    utils.compareItem(password, user.password).then(function(result) {
      if (result) {
        return callback(null, user);
      }

      return callback(null, false);
    }).catch(function (error) {
      return callback(error);
    });
  }).catch(function (error) {
    return callback(error);
  });
}));

passport.serializeUser(function (user, callback) {
  callback(null, user.id);
});

passport.deserializeUser(function (id, callback) {
  const params = [id];

  utils.query(dbConnection, getUserByIdSql, params).then(function (results) {
    const user = results[0];

    if (!user) {
      return callback(null, false);
    }

    callback(null, user);
  });
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

// Initialize passport and restore authentication state.
app.use(passport.initialize());
app.use(passport.session());

// Start server
const port = CONSTANTS.IS_PRODUCTION ? "80" : "8080";

app.listen(port, function () {
  // Home
  app.get("/", function (req, res) {
    if (req.user) {
      res.redirect("/account");

      return;
    }

    res.render("home");
  });

  // Register
  app.get("/register", function(req, res) {
    if (req.user) {
      res.redirect("/account");

      return;
    }

    res.render("register");
  });

  // Register (submit)
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
        res.redirect("/login");
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

  // Login
  app.get("/login", function (req, res) {
    if (req.user) {
      res.redirect("/account");

      return;
    }

    res.render("login");
  });

  // Login (submit)
  app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login"
  }), function (req, res) {
    if (req.user) {
      res.redirect("/account");

      return;
    }

    res.redirect("/register");
  });

  // Recipe list
  app.get("/account", function (req, res) {
    if (!req.user) {
      res.redirect("/login");

      return;
    }

    res.render("account");
  });

  app.get("/addrecipe", function (req, res) {
    // if (!req.user) {
    //   res.redirect("/login");

    //   return;
    // }

    res.render("addrecipe");
  });

  app.get("/recipedetail", function (req, res) {
    // if (!req.user) {
    //   res.redirect("/login");

    //   return;
    // }

    res.render("recipedetail");
  });
});


