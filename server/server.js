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
const updateRecipeSql = require("./queries/update-recipe");
const getRecipeSql = require("./queries/get-recipe");
const getRecipeListSql = require("./queries/get-recipe-list");

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
const port = process.env.PORT || "8080";

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
    console.log("##### 0")

    if(!validators.isValidEmail(req.body.email)) {
      console.log("##### 1")
      res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message="That's not a valid email address." />)));

      return;
    }

    clean.email = req.body.email;

    if(!validators.isValidPassword(req.body.password)) {
      console.log("##### 2")
      res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message="Please enter a password." />)));

      return;
    }
    console.log("##### 3")
    utils.hashItem(req.body.password).then(function (hashedItem) {
      clean.password = hashedItem;
      const params = [clean.email, clean.password];
      console.log("##### 4")
      utils.query(dbConnection, registerSql, params).then(function () {
        console.log("##### 5")
        res.redirect("/login");
      }).catch(function (error) {
        console.log("##### 6")
        res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message={"Couldn't create user: " + error} />)));
      });
    }).catch(function (error) {
      console.log("##### 7")
      res.send(utils.html(ReactDOMServer.renderToString(<RegisterView message="Couldn't hash password." />)));
    });
    console.log("##### 8")
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
  }, (e, a, b, c, d) => console.log("WHAT IS GOING ON", e, a, b, c, d)), function (req, res) {
    console.log("IT WORKED?")
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

    const params = [req.user.id];

    utils.query(dbConnection, getRecipeListSql, params).then(function (results) {
      res.send(utils.html(ReactDOMServer.renderToString(<AccountView recipes={results} />)));
    }).catch(function (error) {
      res.send(utils.html(ReactDOMServer.renderToString(<AccountView message={"Couldn't get recipe list: " + error} />)));
    });
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
    });
  });

  app.get("/recipe/:id", function (req, res) {
    if (!validators.isNumber(req.params.id)) {
      res.send(utils.html(ReactDOMServer.renderToString(<RecipeDetailView message="Please provide a valid recipe ID." />)));

      return;
    }

    const params = [req.params.id];

    utils.query(dbConnection, getRecipeSql, params).then(function (result) {
      const recipeData = result[0];

      res.send(utils.html(ReactDOMServer.renderToString(<RecipeDetailView editable={req.user.id === recipeData["user_id"]} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} />)));
    }).catch(function (error) {
      res.send(utils.html(ReactDOMServer.renderToString(<RecipeDetailView message={"Couldn't get recipe: " + error} />)));
    });
  })

  app.get("/edit/:id", function (req, res) {
    if (!req.user) {
      res.redirect("/login");

      return;
    }

    if (!validators.isNumber(req.params.id)) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message="Please provide a valid recipe ID." />)));

      return;
    }

    const params = [req.params.id];

    utils.query(dbConnection, getRecipeSql, params).then(function (result) {
      const recipeData = result[0];

      if (recipeData["user_id"] !== req.user.id) {
        res.redirect("/recipe/" + req.params.id);

        return;
      }

      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView mode="edit" recipeId={req.params.id} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} />)));
    }).catch(function (error) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message={"Couldn't get recipe: " + error} />)));
    });
  });

  app.post("/edit/:id", function (req, res) {
    if (!req.user) {
      res.redirect("/login");

      return;
    }

    let clean = {};

    if (!validators.isNumber(req.params.id)) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView message="Please provide a valid recipe ID." />)));

      return;
    }

    clean.recipeId = req.params.id;

    const params = [clean.recipeId];

    utils.query(dbConnection, getRecipeSql, params).then(function (result) {
      const recipeData = result[0];

      if (recipeData["user_id"] !== req.user.id) {
        res.redirect("/recipe/" + clean.recipeId);

        return;
      }
      
      if(!validators.isNotEmpty(req.body.recipename)) {
        res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView mode="edit" recipeId={req.params.id} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} message="Please add a recipe name." />)));
  
        return;
      } 
  
      clean.recipeName = req.body.recipename;
  
      if(!validators.isNotEmpty(req.body.category)) {
        res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView mode="edit" recipeId={req.params.id} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} message="Please choose a category." />)));
  
        return;
      } 
  
      clean.category = req.body.category;
  
      if(!validators.isNotEmpty(req.body.ingredients)) {
        res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView mode="edit" recipeId={req.params.id} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} message="Please add some ingredients." />)));
  
        return;
      } 
  
      clean.ingredients = req.body.ingredients;
  
      if(!validators.isNotEmpty(req.body.steps)) {
        res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView mode="edit" recipeId={req.params.id} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} message="Please add the preparation steps." />)));
  
        return;
      } 
  
      clean.steps = req.body.steps;
  
      const params = [clean.recipeName, clean.category, clean.ingredients, clean.steps, clean.recipeId, req.user.id];
  
      utils.query(dbConnection, updateRecipeSql, params).then(function () {
        res.redirect("/recipe/" + clean.recipeId);
      }).catch(function (error) {
        res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView mode="edit" recipeId={req.params.id} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} message={"Couldn't create recipe: " + error} />)));
      });
    }).catch(function (error) {
      res.send(utils.html(ReactDOMServer.renderToString(<AddRecipeView mode="edit" recipeId={req.params.id} name={recipeData.name} category={recipeData.category} ingredients={recipeData.ingredients} steps={recipeData.steps} message={"Couldn't get recipe: " + error} />)));
    });
  });
});
