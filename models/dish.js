var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const enum_measures = require('../enums/mesures');

var DishSchema = new Schema({
  name: { type: String, required: true, min: 3 },
  dish_ingredients: [
    {
      ingredient: {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true
      },
      measure: {
        type: String,
        required: true,
        enum: Object.getOwnPropertyNames(enum_measures)
      },
      amount: { type: Number, required: true },
      cost: { type: Number, required: true }
    }
  ],
  salt: { type: Boolean, required: true },
  pepper: { type: Boolean, required: true },

  people_fed: { type: Number, required: true, min: 1 },

  time_prepare: { type: Number, required: true, min: 0 },
  time_event: { type: Number, required: true, min: 0 },
  hourly_price: { type: Number, required: true, min: 0 },

  gain_percentage: { type: Number, required: true, min: 0 },

  description: { type: String, required: true, min: 1 },

  observations: { type: String, min: 1 }
});

DishSchema.virtual("cost").get(function () {
  const ingredients_cost = this.dish_ingredients.reduce((acc, current) => {
    acc = acc + current.cost;
    return acc
  }, 0);

  const time_cost = (this.time_prepare + this.time_event) * (this.hourly_price / 60);
  return Math.round(ingredients_cost + time_cost);
})

DishSchema.virtual("sellprice").get(function () {
  var factor = Math.pow(10, -1);
  var value = this.cost * (+("1." + this.gain_percentage));
  return Math.round(value * factor) / factor;
})

DishSchema.virtual("total_earnings").get(function () {
  return this.sellprice - this.cost;
})

DishSchema.virtual("cost_per_person").get(function () {
  return Math.round(this.cost / this.people_fed);
})

DishSchema.virtual("sellprice_per_person").get(function () {
  var factor = Math.pow(10, -1);
  var value = (this.sellprice / this.people_fed);
  return Math.round(value * factor) / factor;
})


DishSchema.virtual("url").get(function () {
  return "/dish/" + this.id;
})


// Export model.
module.exports = mongoose.model("Dish", DishSchema);
