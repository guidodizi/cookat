const Review = require("../models/review");
const Chef = require("../models/chef");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

// Display detail page for a specific Author.
exports.chef_detail = function(req, res, next) {
  Chef.findById(req.params.id)
    .populate("user")
    .exec((err, chef) => {
      if (err) {
        return next(err);
      }
      if (chef == null) {
        var err = new Error("No se encontró ningun chef :S");
        err.status = 404;
        return next(err);
      }
      //Successful, render
      res.render("chef_detail", { chef: chef });
    });
};

exports.signup_get = function(req, res, next) {
  res.render("signup_chef");
};

exports.signup_post = [
  body("description", " Debes ingresar una descripcion de tu estilo de cocina.")
    .isLength({ min: 1 })
    .trim(),
  body("phone")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Debes ingresar tu numero de telefono")
    .isNumeric()
    .withMessage("Tu numero de telefono deben ser numeros"),
  body("date_of_birth", "Debes ingresar tu fecha de nacimiento.").isISO8601(),
  sanitizeBody("description")
    .trim()
    .escape(),
  sanitizeBody("phone").toInt(),
  sanitizeBody("date_of_birth").toDate(),
  sanitizeBody("price_hour").toInt(),

  (req, res, next) => {
    if (req.user) {
      const errors = validationResult(req);

      var chef = new Chef({
        user: req.user._id,
        description: req.body.description,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth
      });

      if (!errors.isEmpty()) {
        res.render("signup", { chef: chef, errors: errors.array() });
      } else {
        chef.save(err => {
          if (err) {
            return next(err);
          }
          res.redirect(chef.url);
        });
      }
    } else {
      res.redirect("/signup");
    }
  }
];
