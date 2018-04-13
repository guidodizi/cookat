var express = require("express");
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
  router.get("/signup", isLoggedOut, user_controller.signup_get);

  router.post(
    "/signup",
    isLoggedOut,
    user_controller.signup_post,
    chef_controller.signup_post,
    function(req, res, next) {
      passport.authenticate("local-signup", function(err, user, info) {
        if (err) return next(err);
        if (!user) {
          return res.render("signup", {
            errors: info ? [info] : []
          });
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

  router.get("/signup/chef", isLoggedIn, chef_controller.signup_get);

  router.post("/signup/chef", isLoggedIn, chef_controller.signup_post);

  /**
   * =============================================
   *                LOGIN
   * =============================================
   */

  router.get("/login", isLoggedOut, user_controller.login_get);

  router.post("/login", isLoggedOut, function(req, res, next) {
    passport.authenticate("local-login", function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res.render("login", {
          errors: info ? [info] : []
        });
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
  router.get("/logout", isLoggedIn, function(req, res) {
    app.locals._user = null;
    req.logout();
    res.redirect("/");
  });

  /**
   * =============================================
   *                COMMON
   * =============================================
   */
  router.get("*", isLoggedIn, function(req, res, next) {
    // put user into app.locals for easy access from templates
    if (req.user && !app.locals._user) {
      Chef.findOne({ user: req.user.id }).exec((err, chef) => {
        //set on app locals user information
        app.locals._user = {
          email: req.user.main.email,
          first_name: req.user.main.first_name,
          last_name: req.user.main.last_name,
          chef_id: chef.id
        };
      });
    }
    next();
  });
  /**
   * =============================================
   *                HOME
   * =============================================
   */
  router.get("/", isLoggedIn, (req, res) => {
    Chef.findOne({ user: req.user.id }).exec((err, chef) => {
      return res.redirect("/chef/" + chef.id);
    });
  });

  /**
   * =============================================
   *                DISH
   * =============================================
   */
  /* GET create a new dish. */
  router.get("/dish", isLoggedIn);

  /* POST create a new dish*/
  router.post("/dish", isLoggedIn);

  /**
   * =============================================
   *                CHEF
   * =============================================
   */
  /*GET chef detail page */
  router.get("/chef/:id", isLoggedIn, chef_controller.detail_get);

  /*Chef update page */
  router.get("/chef/:id/update", isLoggedIn, chef_controller.update_get);
  router.post(
    "/chef/:id/update",
    isLoggedIn,
    user_controller.update_post,
    chef_controller.update_post,
    (req, res, next) => {
      // update user in app.locals
      if (req.user) {
        Chef.findOne({ user: req.user.id }).exec((err, chef) => {
          //set on app locals user information
          app.locals._user = {
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            chef_id: chef.id
          };
          res.redirect("/");
        });
      }
    }
  );

  /*Chef change password page */
  router.get(
    "/chef/:id/password_update",
    isLoggedIn,
    user_controller.password_update_get
  );
  router.post(
    "/chef/:id/password_update",
    isLoggedIn,
    user_controller.password_update_post
  );

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

function isLoggedOut(req, res, next) {
  // if user is NOT authenticated in the session, carry on
  if (!req.isAuthenticated()) return next();

  // if user is already authenticated, redirect to its profile page
  Chef.findOne({ user: req.user.id }).exec((err, chef) => {
    return res.redirect("/chef/" + chef.id);
  });
}
