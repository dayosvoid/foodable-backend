const customError = require("../utils/customError")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const USER = require("../model/user.Schema")
dotenv.config()



const authMiddleWware = async(req,res,next)=>{

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return next(new customError("unauthorized: token required",401))
    }
    try {
        const verifyToken = jwt.verify(token,process.env.JWT_SIGNATURE)

        const user =await USER.findById(verifyToken.userId)
        if(!user){
            return next(new customError("unauthorized: user not found",404))
        }

        req.user = user

        next()
    } catch (error) {
         // jwt.verify() throws if token is expired or invalid
        if (error.name === "JsonWebTokenError") {
            return next(new customError("invalid token", 401))
        }
        if (error.name === "TokenExpiredError") {
            return next(new customError("token has expired, please login again", 401))
        }
        return next(error)
    }
}

module.exports = authMiddleWware