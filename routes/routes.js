var express = require("express");
const review_controller = require("../controllers/reviewController");
const user_controller = require("../controllers/userController");
const chef_controller = require("../controllers/chefController");
const Chef = require("../models/chef");

module.exports = function(passport, app) {
  var router = express.Router();
  /**
   * =============================================
   *                SIGN UP
   * =============================================
   */
  router.get("/signup", user_controller.signup_get);

  router.post(
    "/signup",
    user_controller.signup_post,
    chef_controller.signup_post,
    function(req, res, next) {
      passport.authenticate("local-signup", function(err, user, info) {
        if (err) return next(err);
        if (!user) {
          return res.render("signup", { errors: info ? [info] : [] });
        }
        req.logIn(user, function(err) {
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

  /**
   * =============================================
   *                LOGIN
   * =============================================
   */

  router.get("/login", user_controller.login_get);

  router.post("/login", function(req, res, next) {
    passport.authenticate("local-login", function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.render("login", { errors: info ? [info] : [] });
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        Chef.findOne({ user: user.id }).exec((err, chef) => {
          return res.redirect("/chef/" + chef.id);
        });
      });
    })(req, res, next);
  });

  // route for logging out
  router.get("/logout", function(req, res) {
    app.locals._user = null;
    req.logout();
    res.redirect("/");
  });

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
  router.get("/", isLoggedIn, (req, res) => {
    Chef.findOne({ user: req.user.id }).exec((err, chef) => {
      return res.redirect("/chef/" + chef.id);
    });
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
  res.redirect("/login");
}
