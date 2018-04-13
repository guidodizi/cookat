var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DishSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100 },
  ingredients: [
    { type: Schema.Types.ObjectId, ref: "Ingredient", required: true }
  ],
  salt: { type: Boolean, required: true },
  pepper: { type: Boolean, required: true },

  people_fed: { type: Number, required: true, min: 1 },

  time_prepare: { type: Number, required: true, min: 0 },
  time_event: { type: Number, required: true, min: 0 },

  gain_percentage: { type: Number, required: true, min: 0 },

  // image_url: { type: String, required: true, min: 3, max: 500 },
  description: { type: String, required: true, min: 3, max: 1000 },
  needed_tools: { type: String, required: true, min: 3, max: 1000 },
  needed_space: { type: String, required: true, min: 3, max: 1000 },

  max_servings: { type: Number, required: true, min: 1, max: 1000 },
  min_servings: { type: Number, required: true, min: 1, max: 1000 },

  day_in_advance: { type: Number, required: true, min: 1, max: 1000 },

  observations: { type: String, min: 1, max: 1000 }
});

// Export model.
module.exports = mongoose.model("Dish", DishSchema);
