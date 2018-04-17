const Ingredient = require("../models/ingredient");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

exports.list_get = function (req, res, next) {
  res.render("dish_list");
};

exports.create_get = function (req, res, next) {
  Ingredient.find({}, "name default_measure").exec((err, ingredients) => {
    res.render("dish_create", { ingredients: ingredients });
  });
};

exports.create_post = [
  body("name", "Debes ingresar tu nombre.")
    .isLength({ min: 1 })
    .trim(),
  body("chef", "Debes ingresar quien fue tu chef.")
    .isLength({ min: 1 })
    .trim(),
  body("dish", " Debes ingresar de que plato haces la reseña.")
    .isLength({ min: 1 })
    .trim(),
  body("stars", " Debes ingresar el puntaje.").isInt({ gt: 0 }),
  body("review_text", "Debes ingresar algún texto en tu reseña.")
    .isLength({ min: 1 })
    .trim(),

  sanitizeBody("*")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const review = new Review({
      name: req.body.name,
      chef: req.body.chef,
      dish: req.body.dish,
      stars: req.body.stars,
      review_text: req.body.review_text
    });

    //There are errors
    if (!errors.isEmpty()) {
      Chef.find(function (err, result) {
        if (err) {
          return next(err);
        }
        res.render("review_form", {
          title: "Escribe tu reseña",
          chef_list: result,
          review: review,
          errors: errors.array()
        });
      });
      return;
    } else {
      //Data from review is valid
      review.save(function (err) {
        if (err) {
          return next(err);
        }
        //success
        res.redirect("/thanks");
      });
    }
  }
];

exports.review_thanks_get = function (req, res, next) {
  res.render("review_thanks", { title: "Gracias por tu reseña" });
};
