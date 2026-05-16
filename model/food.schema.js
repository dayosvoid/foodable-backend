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
    type:Number,
    min:0,
    max:6,
    required: true,
  },

  mealPeriod :{
    type:String,
    min: 0,
    max:2,
    required:true
  }

},{timestamps:true})

const FOOD = mongoose.model("Food",foodSchema)
module.exports = FOOD