const express = require("express");
const app = require("../app");
const { isLoggedIn } = require('./utils')

var router = express.Router();

// route for logging out
router.get("/", isLoggedIn, function (req, res) {
  app.locals._user = null;
  req.logout();
  res.redirect("/");
});


module.exports = router;