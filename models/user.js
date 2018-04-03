var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;

// define the schema for our user model
var UserSchema = Schema({
  local: {
    email: { type: String, required: true, min: 3, max: 100 },
    password: { type: String, min: 8, max: 100 },
    first_name: { type: String, required: true, min: 3, max: 100 },
    last_name: { type: String, required: true, min: 3, max: 100 }
  },
  facebook: {
    id: String,
    token: String,
    name: String,
    email: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

// methods ======================
UserSchema.virtual("name").get(
  () => this.local.first_name + " " + this.local.last_name
);

// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("User", UserSchema);
