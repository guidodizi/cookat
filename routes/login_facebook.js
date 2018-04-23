const express = require("express");
const { isLoggedIn, isLoggedOut } = require('./utils')

module.exports = function (passport) {
  var router = express.Router();

  // route for facebook authentication and login
  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["email", "public_profile"]
    })
  );

  // handle the callback after facebook has authenticated the user
  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/"
    }),
    function (req, res, next) {
      if (req.user) res.redirect("/chef/" + req.user.id);
    }
  );

  return router;
}