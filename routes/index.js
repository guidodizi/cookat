const express = require("express");
const app = require("../app");
const Chef = require("../models/chef");
const { isLoggedIn } = require('./utils')

var router = express.Router();
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

module.exports = router;