const express = require("express");
const app = require("../app");
const user_controller = require("../controllers/userController");
const chef_controller = require("../controllers/chefController");
const Chef = require("../models/chef");
const { isLoggedIn } = require('./utils')


var router = express.Router();
/*GET chef detail page */
router.get("/:id", isLoggedIn, chef_controller.detail_get);

/*Chef update page */
router.get("/:id/update", isLoggedIn, chef_controller.update_get);
router.post(
  "/:id/update",
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
  "/:id/password_update",
  isLoggedIn,
  user_controller.password_update_get
);
router.post(
  "/:id/password_update",
  isLoggedIn,
  user_controller.password_update_post
);

module.exports = router;