var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;

// define the schema for our user model
var UserSchema = Schema({
  main: {
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
  }
});

UserSchema.virtual("name").get(function() {
  return this.main.first_name + " " + this.main.last_name;
});
UserSchema.virtual("username").get(function() {
  return this.main.first_name + "." + this.main.last_name;
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.main.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model("User", UserSchema);
