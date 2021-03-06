const express = require("express");
const app = require("../app");
const user_controller = require("../controllers/userController");
const event_proposals_controller = require("../controllers/eventProposalController");
const chef_controller = require("../controllers/chefController");
const dish_controller = require("../controllers/dishController");
const Chef = require("../models/chef");

module.exports = function (passport) {
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

  router.get("/signup/chef", isLoggedIn, chef_controller.signup_get);

  router.post("/signup/chef", isLoggedIn, chef_controller.signup_post);

  /**
   * =============================================
   *                LOGIN
   * =============================================
   */

  router.get("/login", isLoggedOut, user_controller.login_get);

  router.post("/login", isLoggedOut, function (req, res, next) {
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

  // route for logging out
  router.get("/logout", isLoggedIn, function (req, res) {
    app.locals._user = null;
    req.logout();
    res.redirect("/");
  });

  /**
   * =============================================
   *                COMMON
   * =============================================
   */
  router.get("*", isLoggedIn, function (req, res, next) {
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
   *                EVENT PROPOSALS
   * =============================================
   */
  /* view all dishes. */
  router.get("/event_proposals", isLoggedIn, event_proposals_controller.list_get);
  router.get("/event_proposal/:id", isLoggedIn, event_proposals_controller.detail_get);

  /* GET create new dishes. */
  router.get("/event_proposals/create", isLoggedIn, dish_controller.create_get);
  /* POST create new dish*/
  router.post("/event_proposals/create", isLoggedIn, dish_controller.create_post);

  /**
   * =============================================
   *                DISH
   * =============================================
   */
  /* view all dishes. */
  router.get("/dish", isLoggedIn, dish_controller.list_get);

  /* GET create new dishes. */
  router.get("/dish/create", isLoggedIn, dish_controller.create_get);
  /* POST create new dish*/
  router.post("/dish/create", isLoggedIn, dish_controller.create_post);

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
    function (req, res, next) {
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
