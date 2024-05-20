const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
   name: {
   type: String,
   required: true
  },
  email: {
   type: String,
   required: true
  },
  password: {
   type: String,
   required: true
  },
  phno: {
    type: String,
    required: true
   },
   UserId: {
    type: String,
    unique: true,
    default: uuidv4 // Generate a unique UserId by default
  },
  createdAt: {
   type: Date,
   default: Date.now
  },
  updatedAt: {
   type: Date,
   default: Date.now
  }
});

module.exports = mongoose.model("User", UserSchema);