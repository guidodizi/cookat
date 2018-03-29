var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ChefSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  first_name: { type: String, required: true, min: 3, max: 100 },
  last_name: { type: String, required: true, min: 3, max: 100 },
  description: { type: String, required: true, min: 3, max: 100 },
  phone: { type: Number, required: true },
  date_of_birth: { type: Date, required: true },
  price_hour: { type: Number, required: true, min: 0, max: 1000 },

  dishes: [{ type: Schema.Types.ObjectId, ref: "Dish" }]
});

ChefSchema.virtual("name").get(() => this.first_name + " " + this.last_name);
ChefSchema.virtual("url").get(() => "/profile/" + this._id);

// Export model.
module.exports = mongoose.model("Chef", ChefSchema);
