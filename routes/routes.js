var express = require("express");
var router = express.Router();
const review_controller = require("../controllers/reviewController");
const user_controller = require("../controllers/userController");
const chef_controller = require("../controllers/chefController");
const User = require("../models/chef");

module.exports = function(passport, app) {
  /**
   * =============================================
   *                SIGN UP
   * =============================================
   */
  router.get("/signup", (req, res) => res.redirect("/signup/user"));

  router.get("/signup/user", user_controller.signup_get);

  router.post(
    "/signup/user",
    user_controller.signup_post,
    passport.authenticate("local-signup", {
      successRedirect: "/signup/chef", // redirect to the secure profile section
      failureRedirect: "/signup/user", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  router.get("/signup/chef", isLoggedIn, chef_controller.signup_get);

  router.post("/signup/chef", isLoggedIn, chef_controller.signup_post);

  /**
   * =============================================
   *                COMMON
   * =============================================
   */
  router.get("*", function(req, res, next) {
    // put user into app.locals for easy access from templates
    if (req.user && !app.locals._user) {
      app.locals._user = {
        email: req.user.local.email,
        first_name: req.user.local.first_name,
        last_name: req.user.local.last_name
      };
    }
    next();
  });
  /**
   * =============================================
   *                HOME
   * =============================================
   */
  /* GET write review form. */
  router.get("/", (req, res) => {
    res.redirect("/login");
  });

  /**
   * =============================================
   *                LOGIN
   * =============================================
   */
  router.get("/login", user_controller.login_get);

  router.post(
    "/login",
    passport.authenticate("local-login", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    user_controller.login_post
  );

  // route for logging out
  router.get("/logout", function(req, res) {
    app.locals._user = null;
    req.logout();
    res.redirect("/");
  });

  /**
   * =============================================
   *                REVIEWS
   * =============================================
   */
  /* GET write review form. */
  router.get("/review", review_controller.review_form_get);

  /* POST write review form*/
  router.post("/review", review_controller.review_form_post);

  /**
   * =============================================
   *                DISH
   * =============================================
   */
  /* GET create a new dish. */
  router.get("/dish", review_controller.review_form_get);

  /* POST create a new dish*/
  router.post("/dish", review_controller.review_form_post);

  /**
   * =============================================
   *                CHEF
   * =============================================
   */
  /*GET chef page */
  router.get("/chef/:id", isLoggedIn, chef_controller.chef_detail);

  // =====================================
  //              FACEBOOK
  // =====================================
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
    function(req, res, next) {
      if (req.user) res.redirect("/chef/" + req.user.id);
    }
  );

  /**
   * =============================================
   *                THANKS
   * =============================================
   */
  /*GET to thanks page */
  router.get("/thanks", review_controller.review_thanks_get);

  /*
   * 
   * 
   * return the router object
   */
  return router;
};

//
//
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}
