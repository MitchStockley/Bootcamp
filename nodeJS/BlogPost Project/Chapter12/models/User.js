const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
var uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
  
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
UserSchema.plugin(uniqueValidator);

//just before you save a new user in the db, encrypt the password

UserSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

//export model
const User = mongoose.model("User", UserSchema);

module.exports = User;
