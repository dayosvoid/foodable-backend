const mongoose = require("mongoose")
const customError = require("../utils/customError")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password: {
        type:String,
        required:true,
    }
},{timestamps:true})

// hash password
userSchema.pre("save", async function hashPassword(next) {
    if(!this.isModified("password")){
        return next()
    }
    const salt = await bcrypt.genSalt(8)
    console.log(salt)
    this.password = await bcrypt.hash(this.password,salt) 
})

// password verification
userSchema.methods.comparePassword = async function (clientPassword) {
    try {
        return await bcrypt.compare(clientPassword, this.password)
    } catch (error) {
        console.error(error)
        return next(new customError("Something went wrong while comparing passwords", 400))
    }  
}

// creating user access token .. so as to get user payload through the middleware 
userSchema.methods.createAccessToken = function(){
 return jwt.sign({userId:this._id, name:this.name},process.env.JWT_SIGNATURE,{expiresIn: process.env.JWT_LIFESPAN})
}

const USER = mongoose.model("User", userSchema)

module.exports = USER
