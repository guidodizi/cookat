var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var IngredientSchema = new Schema({
  name: { type: String, required: true },
  units: {
    total_amount: { type: Number, min: 1 },
    number_of_dishes: { type: Number }
  },
  kg: {
    total_amount: { type: Number, min: 1 },
    number_of_dishes: { type: Number }
  },
  gr: {
    total_amount: { type: Number, min: 1 },
    number_of_dishes: { type: Number }
  },
  lt: {
    total_amount: { type: Number, min: 1 },
    number_of_dishes: { type: Number }
  }
});

IngredientSchema.virtual("default_measure").get(function() {
  let array_used = [
    { measure: "units", amount: this.units.number_of_dishes },
    { measure: "kg", amount: this.kg.number_of_dishes },
    { measure: "gr", amount: this.gr.number_of_dishes },
    { measure: "lt", amount: this.lt.number_of_dishes }
  ];
  return array_used.reduce((acc, currentValue) => {
    if (currentValue.amount >= acc.amount) return currentValue;
    return acc;
  }, array_used[0]).measure;
});

// Export model.
module.exports = mongoose.model("Ingrendient", IngredientSchema);
