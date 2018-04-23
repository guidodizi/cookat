const express = require("express");
const user_controller = require("../controllers/userController");
const chef_controller = require("../controllers/chefController");
const Chef = require("../models/chef");
const { isLoggedOut } = require('./utils')


module.exports = function (passport) {
  var router = express.Router();

  router.get("/", isLoggedOut, user_controller.signup_get);

  router.post(
    "/",
    isLoggedOut,
    user_controller.signup_post,
    chef_controller.signup_post,
    function (req, res, next) {
      passport.authenticate("local-signup", function (err, user, info) {
        if (err) return next(err);
        if (!user) {
          return res.render("signup", {
            errors: info ? [info] : []
          });
        }
        req.logIn(user, function (err) {
          if (err) {
            return next(err);
          }
          Chef.findOne({ user: user.id }).exec((err, chef) => {
            return res.redirect("/chef/" + chef.id);
          });
        });
      })(req, res, next);
    }
  );

  //return the router
  return router;
}

// NOT YET
// router.get("/signup/chef", isLoggedIn, chef_controller.signup_get);

// router.post("/signup/chef", isLoggedIn, chef_controller.signup_post);

