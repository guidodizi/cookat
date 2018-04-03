const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const Chef = require("../models/chef");

exports.login_get = function(req, res, next) {
  res.render("login", { errors: req.flash("error") });
};

exports.signup_get = function(req, res, next) {
  var errors = req.flash("error");
  res.render("signup_user", { errors: errors });
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
      return res.render("signup_user", { errors: errors.array() });
    }
    if (req.body.password != req.body.password_confirm) {
      return res.render("signup_user", {
        errors: [{ msg: "Contraseñas no coinciden" }]
      });
    }
    return next();
  }
];
