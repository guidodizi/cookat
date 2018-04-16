var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DishIngredientSchema = new Schema({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: "Ingredient",
    required: true
  },
  measure: {
    type: String,
    required: true,
    enum: ["unidades", "kg", "gr", "litros"]
  },
  amount: { type: Number, required: true },
  cost: { type: Number, required: true }
});

// Export model.
module.exports = mongoose.model("DishIngredient", DishIngredientSchema);
