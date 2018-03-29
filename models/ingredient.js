var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Ingredient = new Schema({
  ingredient_name: {
    type: Schema.Types.ObjectId,
    ref: "IngredientName",
    required: true
  },
  amount: { type: Number, required: true, min: 0, max: 100 },
  measure: {
    type: String,
    required: true,
    enum: ["unidades", "kg", "gr", "litros"]
  },
  cost: { type: Number, required: true, min: 0, max: 100 }
});

// Export model.
module.exports = mongoose.model("Ingredient", Ingredient);
