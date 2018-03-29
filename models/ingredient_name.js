var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var IngredientName = new Schema({
  name: { type: String, required: true, min: 1, max: 100 }
});

// Export model.
module.exports = mongoose.model("Chef", ChefSchema);
