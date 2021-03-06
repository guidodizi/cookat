require("dotenv").config();
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var passport = require("passport");
var flash = require("connect-flash");
var session = require("express-session");
var moment = require("moment");

moment.locale("es");
moment.defaultFormat = "D MMMM YYYY";

var app = express();

// Set up mongoose connection
var mongoose = require("mongoose");

var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

require("./config/passport")(passport); // pass passport for configuration

app.use(favicon(path.join(__dirname, "public", "mariofavicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//give jade files access to moment
app.locals.moment = require("moment");

// required for passport
app.use(session({ secret: "cookatsecretsauce" })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

module.exports = app;


/**
 * 
 * Route handling
 * 
 */
var signup_router = require("./routes/signup")(passport);
var login_router = require("./routes/login")(passport);
var logout_router = require("./routes/logout");
// var login_facebook = require("./routes/login_facebook")(passport);
var index_router = require("./routes/index");
var chef_router = require("./routes/chef");
var dish_router = require("./routes/dish");
var event_proposal_router = require("./routes/event_proposal");

app.use("/signup", signup_router);
app.use("/login", login_router);
app.use("/logout", logout_router);
app.use("/", index_router);
app.use("/chef", chef_router);
app.use("/dish", dish_router);
app.use("/event_proposals", event_proposal_router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

