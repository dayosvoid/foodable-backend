const errorHandling = require("../middleware/error.middleware")
const customError = require("../utils/customError")
const USER = require("../model/user.Schema")
const jwt = require("jsonwebtoken")

const handleRegister = async(req,res,next)=>{
    const {name,email,password} = req.body

    if(!name || !email || !password){
        return next(new customError("all input-fields are required", 400))
    }
    try {
        const emailAlreadyExist = await USER.findOne({email:email})
        if(emailAlreadyExist){
            return next(new customError("User already exist", 400))
        }

        // saving user data
        const newUser = await USER.create({
            name,email,password
        })

        return res.status(201).json({
            success:true,
            message:"registration successful"
        })

    } catch (error) {
    console.log("CATCH ERROR:", error) // add this
    return next(error)

    }
}


const handleLogin =  async(req,res,next)=>{
    const {email,password} = req.body

    if(!email || !password){
        return next(new customError("Invaild credential",400))
    }
    try {
       const userExist = await USER.findOne({email:email})
       if(!userExist) {
        return next(new customError("User does not exist", 404))
       }

       const verifyUser = await userExist.comparePassword(password)
       if(!verifyUser){
        return next(new customError("invalid email or password", 400))
       }

       const token = userExist.createAccessToken()

       return res.status(200).json({
        success:true,
        message:`welcome ${userExist.name}`,
        token
       })
    } catch (error) {
        return next(error)
    }
}

const handleLogout = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "logged out successfully"
        })
    } catch (error) {
        return next(error)
    }
}

module.exports = {handleRegister,handleLogin,handleLogout}