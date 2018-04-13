const Chef = require("../models/chef");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const moment = require("moment");

// Display detail page for a specific Author.
exports.detail_get = function(req, res, next) {
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
      res.render("chef_detail", {
        title: "Chef: " + req.user.name,
        chef: chef
      });
    });
};

exports.signup_get = function(req, res, next) {
  res.render("FB_signup_chef");
};

exports.signup_post = [
  body("description", "Tu descripcion debe tener entre 100 y 500 caracteres")
    .isLength({ min: 100, max: 500 })
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
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("signup", {
        user: {
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          phone: req.body.phone,
          date_of_birth: req.body.date_of_birth,
          description: req.body.description
        },
        errors: errors.array()
      });
    }
    return next();
  }
];

exports.update_get = function(req, res, next) {
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
      res.render("chef_update", {
        user: {
          email: req.user.main.email,
          first_name: req.user.main.first_name,
          last_name: req.user.main.last_name,
          phone: chef.phone,
          date_of_birth: chef.date_of_birth,
          description: chef.description
        }
      });
    });
};

exports.update_post = [
  body("description", " Debes ingresar una descripcion de tu estilo de cocina.")
    .isLength({ min: 100, max: 500 })
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
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("chef_update", {
        user: {
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          phone: req.body.phone,
          date_of_birth: req.body.date_of_birth,
          description: req.body.description
        },
        errors: errors.array()
      });
    } else {
      //keep same id of chef and same user thats signed in
      var chef = new Chef({
        _id: req.params.id,
        user: req.user.id,
        description: req.body.description,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth
      });

      Chef.findByIdAndUpdate(req.params.id, chef, function(err, new_chef) {
        if (err) return next(err);
        next();
      });
    }
  }
];
