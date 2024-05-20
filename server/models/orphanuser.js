const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const orphanuserSchema = new Schema({
    instname: {
   type: String,
   required: true
  },
  dir: {
   type: String,
   required: true
  },
  address: {
   type: String,
   required: true
  },

  pincode: {
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
   emailid: {
    type: String,
    required: true
   },
   regno: {
    type: String,
    required: true
   },
   licenseno: {
    type: String,
    required: true
   },
   accreditationno: {
    type: String,
    required: true
   },
   noOfChildren:{
    type:String
   },
   noOfStaff:{
type:String
   },
   isActive:{
    type:Boolean
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

module.exports = mongoose.model("OrphanUser", orphanuserSchema);