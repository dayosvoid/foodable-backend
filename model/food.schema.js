const mongoose = require('mongoose')
const {Schema} = require("mongoose")

const foodSchema = new mongoose.Schema({
  user:{
    type: Schema.Types.ObjectId,
    ref:'User',
    required:true
  },

  name:{
    type:String,
    required:true,
  },
  day:{
    type:String,
    enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"], 
    required: true,
  },

  mealPeriod :{
    type:String,
    enum:["breakfast", "lunch", "dinner"],
    required:true
  }

},{timestamps:true})

const FOOD = mongoose.model("Food",foodSchema)
module.exports = FOOD