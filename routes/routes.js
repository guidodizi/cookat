var express = require("express");
var router = express.Router();
const review_controller = require("../controllers/reviewController");
const user_controller = require("../controllers/userController");
const chef_controller = require("../controllers/chefController");

module.exports = function(passport) {
  /**
   * =============================================
   *                Home
   * =============================================
   */
  /* GET write review form. */
  router.get("/", (req, res) => {
    res.redirect("/login");
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
  router.get("/chef/:id", chef_controller.chef_detail);

  router.get("/signup/chef", isLoggedIn, chef_controller.signup_get);

  router.post("/signup/chef", isLoggedIn, chef_controller.signup_post);

  // =====================================
  // FACEBOOK ROUTES =====================
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
    function(req, res, next) {
      if (req.user) res.redirect("/chef/" + req.user.id);
    }
  );

  // route for logging out
  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  /**
   * =============================================
   *                SIGN UP
   * =============================================
   */
  router.get("/signup", (req, res) => res.redirect("/signup/user"));

  router.get("/signup/user", user_controller.signup_get);

  router.post("/signup/user", user_controller.signup_post, (req, res, next) => {
    passport.authenticate("local-signup", {
      successRedirect: "/signup/chef", // redirect to the secure profile section
      failureRedirect: "/signup/user", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    });
  });

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
