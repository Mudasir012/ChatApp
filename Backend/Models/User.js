const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    default: "",
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/40",
  },
  status: {
    type: String,
    default: "Hey there! I'm using ChatApp",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);