#! /usr/bin/env node
require("dotenv").config();

var async = require("async");
var Ingredient = require("./models/ingredient");
var Dish = require("./models/dish");
var EventProposal = require("./models/event_proposal");
var Chef = require("./models/chef");
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

function eventProposalCreate(cb) {
  var event_proposal = new EventProposal({
    name: "Almuerzo Toscano",
    appetizers: dishes.filter(d => d.name == "Brusquettas de Palta"),
    dishes: dishes.filter(d => d.name == "Rissoto de Hongos"),
    description: "Un evento al mejor estilo italiano",
    needed_tools: "Una cocina de familia",
    needed_space: "nada en especial",

    max_servings: 25,
    min_servings: 4,

    day_in_advance: 5,

    observations: ""
  });

  event_proposal.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Event: " + event_proposal);
    cb(null, event_proposal);

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
              ingredient: ingredients.filter(i => i.name == 'Arroz')[0]._id,
              measure: enum_measure.tazas,
              amount: 1.5,
              cost: 20
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Ajo')[0]._id,
              measure: enum_measure.unidades,
              amount: 2,
              cost: 5
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Hongos')[0]._id,
              measure: enum_measure.gr,
              amount: 400,
              cost: 100
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Cebolla')[0]._id,
              measure: enum_measure.unidades,
              amount: 1,
              cost: 8
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Queso Parmesano')[0]._id,
              measure: enum_measure.gr,
              amount: 100,
              cost: 125
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Caldo')[0]._id,
              measure: enum_measure.litros,
              amount: 1,
              cost: 35
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Vino Blanco')[0]._id,
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
        dishCreate({
          name: "Brusquettas de Palta",
          dish_ingredients: [
            {
              ingredient: ingredients.filter(i => i.name == 'Pan')[0]._id,
              measure: enum_measure.unidades,
              amount: 1,
              cost: 35
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Queso de Cabra')[0]._id,
              measure: enum_measure.gr,
              amount: 100,
              cost: 170
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Palta')[0]._id,
              measure: enum_measure.unidades,
              amount: 2,
              cost: 150
            },
            {
              ingredient: ingredients.filter(i => i.name == 'Tomate Cherry')[0]._id,
              measure: enum_measure.unidades,
              amount: 20,
              cost: 200
            }
          ],
          salt: true,
          pepper: false,
          people_fed: 4,
          time_prepare: 45,
          time_event: 10,
          hourly_price: 100,
          gain_percentage: 40,
          description: "Frescas brusquettas de palta y tomates, acompañadas de un gustoso queso de cabra",
          observations: ''
        }, callback);
      },
    ],
    // optional callback
    cb
  );
}

EventProposal.findOne(function (err, ep) {
  if (err) return err;
  Chef.findById('5acfabc3d0415c338c2fa3ab', function (err, chef) {
    if (err) return err;
    chef.event_proposals.push(ep._id);
    chef.save(function (err, chef) {
      if (err) return err;
      console.log('SUCCESS!: ' + JSON.stringify(chef))
    })
  })
})

// async.series(
//   [
//     ingredientsCreate,
//     dishesCreate,
//     eventProposalCreate
//   ],
//   // Optional callback
//   function (err, results) {
//     if (err) {
//       console.log("FINAL ERR: " + err);
//     } else {
//     }
//     // All done, disconnect from database
//     mongoose.connection.close();
//   }
// );
