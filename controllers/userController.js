const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
const Chef = require("../models/chef");

exports.login_get = function(req, res, next) {
  res.render("login", { errors: req.flash("error") });
};

exports.signup_user_get = function(req, res, next) {
  var errors = req.flash("error");
  res.render("signup_user", { errors: errors });
};

exports.signup_user_post = [
  body("email")
    .exists()
    .isLength({ min: 1 })
    .withMessage("Debes ingresar tu email")
    .isEmail()
    .withMessage("Formato de email incorrecto")
    .trim(),

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

exports.signup_chef_get = function(req, res, next) {
  res.render("signup_chef");
};

exports.signup_chef_post = [
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
  body("price_hour")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Debes ingresar tu precio por hora")
    .isInt({ min: 0, max: 1000 })
    .withMessage("Tu precio por hora deben ser numeros"),

  sanitizeBody("first_name")
    .trim()
    .escape(),
  sanitizeBody("last_name")
    .trim()
    .escape(),
  sanitizeBody("description")
    .trim()
    .escape(),
  sanitizeBody("phone").toInt(),
  sanitizeBody("date_of_birth").toDate(),
  sanitizeBody("price_hour").toInt(),

  (req, res, next) => {
    console.log(req.user._id);
    //create a chef with this id for user!!
    console.log(req.user.id);
    console.log(req.user);
    console.log(req);

    if (req.user) {
      const errors = validationResult(req);

      var chef = new Chef({
        user: req.user._id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        description: req.body.description,
        phone: req.body.phone,
        date_of_birth: req.body.date_of_birth,
        price_hour: req.body.price_hour
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

    res.redirect("/");
  }
];
