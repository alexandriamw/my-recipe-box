// Dependencies
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const React = require("react");
const ReactDOMServer = require("react-dom/server");

// App-specific
const CONSTANTS = require("./helpers/constants");
const utils = require("./helpers/utils");
const validators = require("./helpers/validators");

// Views
const AccountView = require("./views/account");
const AddRecipeView = require("./views/add-recipe");
const HomeView = require("./views/home");
const LoginView = require("./views/login");
const RecipeDetailView = require("./views/recipe-detail");
const RegisterView = require("./views/register");

// Queries
const registerSql = require("./queries/register");
const getUserByEmailSql = require("./queries/get-user-by-email");
const getUserByIdSql = require("./queries/get-user-by-id");
const addRecipeSql = require("./queries/add-recipe");

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

    utils.compareItem(password, user.password).then(function (result) {
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

    res.send(utils.html(ReactDOMServer.renderToString(<HomeView />)));
  });

  // Register
  app.get("/register", function (req, res) {
    if (req.user) {
      res.redirect("/account");

      return;
    }

    res.send(utils.html(ReactDOMServer.renderToString(<RegisterView />)));
  });

  // Register (submit)
  app.post("/register", function (req, res) {
    let clean = {};

    if(!validators.isValidEmail(req.body.email)) {
      res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message="That's not a valid email address." />)));

      return;
    }

    clean.email = req.body.email;

    if(!validators.isValidPassword(req.body.password)) {
      res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message="Please enter a password." />)));

      return;
    }

    utils.hashItem(req.body.password).then(function (hashedItem) {
      clean.password = hashedItem;
      const params = [clean.email, clean.password];

      utils.query(dbConnection, registerSql, params).then(function () {
        res.redirect("/login");
      }).catch(function (error) {
        res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message={"Couldn't create user: " + error} />)));
      })
    }).catch(function (error) {
      res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message="Couldn't hash password." />)));
    });

    return;
  });

  // Login
  app.get("/login", function (req, res) {
    if (req.user) {
      res.redirect("/account");

      return;
    }

    res.send(utils.html(ReactDOMServer.renderToString(<LoginView />)));
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

    res.send(utils.html(ReactDOMServer.renderToString(<AccountView />)));
  });

  app.get("/addrecipe", function (req, res) {
    if (!req.user) {
      res.redirect("/login");

      return;
    }

    res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView />)));
  });

  app.post("/addrecipe", function (req, res) {
    if (!req.user) {
      res.redirect("/login");

      return;
    }

    let clean = {};

    if(!validators.isNotEmpty(req.body.recipename)) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message="Please add a recipe name." />)));

      return;
    } 

    clean.recipeName = req.body.recipename;

    if(!validators.isNotEmpty(req.body.category)) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message="Please choose a category." />)));

      return;
    } 

    clean.category = req.body.category;

    if(!validators.isNotEmpty(req.body.ingredients)) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message="Please add some ingredients." />)));

      return;
    } 

    clean.ingredients = req.body.ingredients;

    if(!validators.isNotEmpty(req.body.steps)) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message="Please add the preparation steps." />)));

      return;
    } 

    clean.steps = req.body.steps;

    const params = [req.user.id, clean.recipeName, clean.category, clean.ingredients, clean.steps];

    utils.query(dbConnection, addRecipeSql, params).then(function (result) {
      const recipeId = result.insertId;
      res.redirect("/recipe/" + recipeId);
    }).catch(function (error) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message={"Couldn't create recipe: " + error} />)));
    })
  });

  app.get("/recipedetail", function (req, res) {
    if (!req.user) {
      res.redirect("/login");

      return;
    }

    res.send(utils.html(ReactDOMServer.renderToString(<RecipeDetailView />)));
  });

  app.get("/recipe/:id", function (req, res) {
    // do recipe detail view
  })
});