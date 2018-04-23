var Chef = require('../models/chef');

// make sure a user is logged in
exports.isLoggedIn = function (req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/login");
}

exports.isLoggedOut = function (req, res, next) {
  // if user is NOT authenticated in the session, carry on
  if (!req.isAuthenticated()) return next();

  // if user is already authenticated, redirect to its profile page
  Chef.findOne({ user: req.user.id }).exec((err, chef) => {
    return res.redirect("/chef/" + chef.id);
  });
}
