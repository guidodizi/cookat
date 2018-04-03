var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ChefSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },

  phone: { type: Number, required: true },
  date_of_birth: { type: Date, required: true },
  description: { type: String, required: true, min: 3, max: 100 },

  dishes: [{ type: Schema.Types.ObjectId, ref: "Dish" }]
});

ChefSchema.virtual("url").get(() => "/chef/" + this._id);
ChefSchema.virtual("date_of_birth_formatted").get(function() {
  return this.date_of_birth
    ? moment(this.date_of_birth).format("MMMM Do, YYYY")
    : "";
});

// Export model.
module.exports = mongoose.model("Chef", ChefSchema);
