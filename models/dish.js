var mongoose = require("mongoose");
var Schema = mongoose.Schema;

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
        enum: ["unidades", "kg", "gr", "litros"]
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

// Export model.
module.exports = mongoose.model("Dish", DishSchema);
