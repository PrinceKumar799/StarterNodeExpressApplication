const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  userName: String,
  password: String,
  roles: [Number],
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
