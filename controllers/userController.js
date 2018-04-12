const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const Chef = require("../models/chef");
const User = require("../models/user");

exports.login_get = function(req, res, next) {
  res.render("login");
};

exports.signup_get = function(req, res, next) {
  res.render("signup");
};

exports.signup_post = [
  body("email")
    .exists()
    .isLength({ min: 1 })
    .withMessage("Debes ingresar tu email")
    .isEmail()
    .withMessage("Formato de email incorrecto")
    .trim(),
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Debes ingresar tu nombre de pila.")
    .isAlpha()
    .withMessage("Tu nombre debe contener solo letras"),

  body("last_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Debes ingresar tu apellido.")
    .isAlpha()
    .withMessage("Tu apellido debe contener solo letras"),
  body("password")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Contraseña debe tener al menos 8 caracteres.")
    .trim(),

  body("password_confirm"),

  sanitizeBody("*")
    .trim()
    .escape(),

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
    if (req.body.password != req.body.password_confirm) {
      return res.render("signup", {
        user: {
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          phone: req.body.phone,
          date_of_birth: req.body.date_of_birth,
          description: req.body.description
        },
        errors: [{ msg: "Contraseñas no coinciden" }]
      });
    }
    return next();
  }
];

exports.update_post = [
  body("email")
    .exists()
    .isLength({ min: 1 })
    .withMessage("Debes ingresar tu email")
    .isEmail()
    .withMessage("Formato de email incorrecto")
    .trim(),
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Debes ingresar tu nombre de pila.")
    .isAlpha()
    .withMessage("Tu nombre debe contener solo letras"),

  body("last_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Debes ingresar tu apellido.")
    .isAlpha()
    .withMessage("Tu apellido debe contener solo letras"),

  sanitizeBody("*")
    .trim()
    .escape(),

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
      var user = new User();
      //keep same id, so its the same user
      user._id = req.user.id;

      //set new values
      user.local.email = req.body.email;
      user.local.first_name = req.body.first_name;
      user.local.last_name = req.body.last_name;

      //keep password and facebook from user
      user.local.password = req.user.local.password;
      user.facebook = req.user.facebook;

      User.findByIdAndUpdate(req.user.id, user, function(err, new_user) {
        if (err) return next(err);
        return next();
      });
    }
  }
];
