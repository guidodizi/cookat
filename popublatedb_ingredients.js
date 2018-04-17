#! /usr/bin/env node
require("dotenv").config();

var async = require("async");
var Ingredient = require("./models/ingredient");
var Dish = require("./models/dish");
var EventProposal = require("./models/event_proposal");
const enum_measure = require('./enums/mesures')

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
var dishes = [];

function ingredientCreate(name, cb) {
  var ingredient = new Ingredient({
    name: name
  });

  ingredient.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Ingredient: " + ingredient);
    ingredients.push(ingredient);
    cb(null, ingredient);
  });
}

function dishCreate(dish, cb) {
  var dish = new Dish({
    name: dish.name,
    dish_ingredients: dish.dish_ingredients,
    salt: dish.salt,
    pepper: dish.pepper,
    people_fed: dish.people_fed,
    time_prepare: dish.time_prepare,
    time_event: dish.time_event,
    hourly_price: dish.hourly_price,
    gain_percentage: dish.gain_percentage,
    description: dish.description,
    observations: dish.observations
  });

  dish.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Dish: " + dish);
    dishes.push(dish);
    cb(null, dish);
  });
}

function ingredientsCreate(cb) {
  async.parallel(
    [
      //brusquetta
      function (callback) {
        ingredientCreate("Pan", callback);
      },
      function (callback) {
        ingredientCreate("Queso de Cabra", callback);
      },
      function (callback) {
        ingredientCreate("Palta", callback);
      },
      function (callback) {
        ingredientCreate("Tomate Cherry", callback);
      },
      //risoto
      function (callback) {
        ingredientCreate("Ajo", callback);
      },
      function (callback) {
        ingredientCreate("Hongos", callback);
      },
      function (callback) {
        ingredientCreate("Arroz", callback);
      },
      function (callback) {
        ingredientCreate("Cebolla", callback);
      },
      function (callback) {
        ingredientCreate("Queso Parmesano", callback);
      },
      function (callback) {
        ingredientCreate("Caldo", callback);
      },
      function (callback) {
        ingredientCreate("Vino Blanco", callback);
      }
    ],
    // optional callback
    cb
  );
}
function dishesCreate(cb) {
  async.parallel(
    [
      function (callback) {
        dishCreate({
          name: "Rissoto de Hongos",
          dish_ingredients: [
            {
              ingredient: ingredients.filter(i => i.name == 'Arroz')._id,
              measure: enum_measure.tazas,
              amount: 1.5,
              cost: 20
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Ajo')._id,
              measure: enum_measure.unidades,
              amount: 2,
              cost: 5
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Hongos')._id,
              measure: enum_measure.gr,
              amount: 400,
              cost: 100
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Cebolla')._id,
              measure: enum_measure.unidades,
              amount: 1,
              cost: 8
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Queso Parmesano')._id,
              measure: enum_measure.gr,
              amount: 100,
              cost: 125
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Caldo')._id,
              measure: enum_measure.litros,
              amount: 1,
              cost: 35
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Vino Blanco')._id,
              measure: enum_measure.ml,
              amount: 300,
              cost: 150
            }
          ],
          salt: true,
          pepper: true,
          people_fed: 4,
          time_prepare: 40,
          time_event: 30,
          hourly_price: 150,
          gain_percentage: 40,
          description: "Rissoto de hongos al estilo italiano, con un toque de vino blanco que realza el sabor al parmesano",
          observations: ''
        }, callback);
      },
      function (callback) {
        dishCreate("Ajo", callback);
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [ingredientsCreate,
  ],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
