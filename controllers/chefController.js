const Review = require("../models/review");
const Chef = require("../models/chef");

const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
  async.parallel(
    {
      author: function(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: function(callback) {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      }
    },
    function(err, results) {
      if (err) {
        debug("mongo error -> while getting author or author's books");
        return next(err);
      } // Error in API usage.
      if (results.author == null) {
        // No results.
        debug("error -> author not found");
        var err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      debug("success -> getting detail of author id %o", req.params.id);
      res.render("author_detail", {
        title: "Author Detail",
        author: results.author,
        author_books: results.authors_books
      });
    }
  );
};

exports.review_form_post = [
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
      Chef.find(function(err, result) {
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
      review.save(function(err) {
        if (err) {
          return next(err);
        }
        //success
        res.redirect("/thanks");
      });
    }
  }
];

exports.review_thanks_get = function(req, res, next) {
  res.render("review_thanks", { title: "Gracias por tu reseña" });
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
