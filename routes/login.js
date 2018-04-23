const express = require("express");
const app = require("../app");
const user_controller = require("../controllers/userController");
const Chef = require("../models/chef");
const { isLoggedIn, isLoggedOut } = require('./utils')

module.exports = function (passport) {
  var router = express.Router();

  router.get("/", isLoggedOut, user_controller.login_get);

  router.post("/", isLoggedOut, function (req, res, next) {
    passport.authenticate("local-login", function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.render("login", {
          errors: info ? [info] : []
        });
      }
      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        Chef.findOne({ user: user.id }).exec((err, chef) => {
          if (err) return next(err);
          return res.redirect("/chef/" + chef.id);
        });
      });
    })(req, res, next);
  });

  //return the router
  return router;
}