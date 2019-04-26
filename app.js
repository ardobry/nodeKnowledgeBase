const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");

//Connect to our db
mongoose.connect("mongodb://localhost/nodekb");
let db = mongoose.connection;

//Check connection
db.once("open", () => console.log("Connected to MongoDB"));

//Check for DB errors
db.on("error", err => {
  console.log(err);
});

//Init app
const app = express();

//Bring in Models
let Article = require("./models/article");

//Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Body parser Middleware
//application/x-www-form-uriencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

//Set Public Folder as static for express
app.use(express.static(path.join(__dirname, "public")));

//Express Session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//Express Messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

//Home route
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) console.log(err);
    res.render("index", {
      title: "Articles",
      articles
    });
  });
});

//Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
//Anything that goes articles/[sth] uses that file
app.use('/articles', articles);
app.use('/users', users);


//Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
