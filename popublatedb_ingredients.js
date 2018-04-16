#! /usr/bin/env node
require("dotenv").config();

var async = require("async");
var Ingredient = require("./models/ingredient");

console.log(process.env.MONGODB_URI);
var mongoose = require("mongoose");
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

var db = mongoose.connection;
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

var ingredients = [];

function ingredientCreate(name, cb) {
  var ingredient = new Ingredient({
    name: name
  });

  ingredient.save(function(err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Ingredient: " + ingredient);
    ingredients.push(ingredient);
    cb(null, ingredient);
  });
}

function ingredientsCreate(cb) {
  async.parallel(
    [
      function(callback) {
        ingredientCreate("Ajo", callback);
      },
      function(callback) {
        ingredientCreate("Arroza", callback);
      },
      function(callback) {
        ingredientCreate("Cebolla", callback);
      },
      function(callback) {
        ingredientCreate("Queso Parmesano", callback);
      },
      function(callback) {
        ingredientCreate("Caldo", callback);
      },
      function(callback) {
        ingredientCreate("Vino Blanco", callback);
      }
    ],
    // optional callback
    cb
  );
}

async.series(
  [ingredientsCreate],
  // Optional callback
  function(err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
