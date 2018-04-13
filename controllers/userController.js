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

exports.password_update_get = function(req, res, next) {
  res.render("password_update");
};

exports.signup_post = [
  (req, res, next) => {
    const date_array = req.body.date_of_birth.split("/");
    date_array[0] = +date_array[0];
    req.body.date_of_birth = new Date(
      date_array[2] + "-" + date_array[1] + "-" + date_array[0]
    ).toISOString();
    next();
  },
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
exports.password_update_post = [
  (req, res, next) => {
    if (!req.user.validPassword(req.body.original_password)) {
      return res.render("password_update", {
        errors: [{ msg: "Contraseña original no es correcta!" }]
      });
    }
    next();
  },
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
      return res.render("password_update", {
        errors: errors.array()
      });
    }
    if (req.body.password != req.body.password_confirm) {
      return res.render("password_update", {
        errors: [{ msg: "Contraseñas no coinciden" }]
      });
    }
    var user = new User();
    user = req.user;
    user.main.password = user.generateHash(req.body.password);
    User.findByIdAndUpdate(req.user.id, user, function(err, new_user) {
      if (err) return next(err);
      return res.redirect("/");
    });
  }
];

exports.update_post = [
  (req, res, next) => {
    const date_array = req.body.date_of_birth.split("/");
    date_array[0] = +date_array[0];
    req.body.date_of_birth = new Date(
      date_array[2] + "-" + date_array[1] + "-" + date_array[0]
    ).toISOString();
    next();
  },
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
    .withMessage("Debes ingresar tu nombre de pila."),

  body("last_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Debes ingresar tu apellido."),

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
      user.main.email = req.body.email;
      user.main.first_name = req.body.first_name;
      user.main.last_name = req.body.last_name;

      //keep password and facebook from user
      user.main.password = req.user.main.password;
      user.facebook = req.user.facebook;

      User.findByIdAndUpdate(req.user.id, user, function(err, new_user) {
        if (err) return next(err);
        return next();
      });
    }
  }
];
