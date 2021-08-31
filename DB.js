const mongoose = require("mongoose");

const User = mongoose.Schema({
  name: String,
  age: Number,
});

module.exports = mongoose.model("User", User);