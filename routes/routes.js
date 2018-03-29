var express = require("express");
var router = express.Router();
const review_controller = require("../controllers/reviewController");
const user_controller = require("../controllers/userController");

module.exports = function(passport) {
  /**
   * =============================================
   *                REVIEWS
   * =============================================
   */
  /* GET write review form. */
  router.get("/", (req, res) => {
    res.render("index");
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
   *                PROFILE
   * =============================================
   */
  /*GET profile page */
  //router.get("/profile/:id", chef_controller.chef_detail);

  // =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  router.get(
    "/auth/facebook",
    passport.authenticate("facebook", {
      scope: ["email"]
    })
  );

  // handle the callback after facebook has authenticated the user
  router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      failureRedirect: "/"
    }),
    function(req, res, next) {
      if (req.user) res.redirect("/profile/" + req.user.id);
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
      if (req.user) res.redirect("/profile/" + req.user.id);
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

  router.get("/signup/user", user_controller.signup_user_get);

  router.post(
    "/signup/user",
    user_controller.signup_user_post,
    passport.authenticate("local-signup", {
      successRedirect: "/signup/chef", // redirect to the secure profile section
      failureRedirect: "/signup/user", // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
    })
  );

  router.get("/signup/chef", isLoggedIn, user_controller.signup_chef_get);

  router.post("/signup/chef", isLoggedIn, user_controller.signup_chef_post);

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
