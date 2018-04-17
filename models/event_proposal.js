var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventProposalSchema = new Schema({
  name: { type: String, required: true, min: 3 },
  appetizers: [
    { type: Schema.Types.ObjectId, ref: "Dish", required: true }
  ],
  dishes: [
    { type: Schema.Types.ObjectId, ref: "Dish", required: true }
  ],
  description: { type: String, required: true, min: 1 },
  needed_tools: { type: String, required: true, min: 1 },
  needed_space: { type: String, required: true, min: 1 },

  max_servings: { type: Number, required: true, min: 1 },
  min_servings: { type: Number, required: true, min: 1 },

  day_in_advance: { type: Number, required: true, min: 1 },

  observations: { type: String, min: 1 }
});


EventProposalSchema.virtual("url").get(function () {
  return "/event_proposal/" + this._id;
});

// Export model.
module.exports = mongoose.model("EventProposal", EventProposalSchema);
