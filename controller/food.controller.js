const FOOD = require("../model/food.schema")
const USER =  require("../model/user.Schema")
const customError  = require("../utils/customError")

const handleCreateFood = async(req,res,next)=>{
    // console.log("hitting route")
    const {name,day,mealPeriod} = req.body
    const userId = req.user._id 

    if( !day || !name ||!mealPeriod){
         return next(new customError("all input-fields are required", 400))
    }

    if(!userId){
         return next(new customError("all input-fields are required1", 400)) 
    }

    try {
       const userExist = await USER.findById(userId)
        if(!userExist) {
            return next(new customError("user not found",404))
        }

        // get all meals for this user on this day
        const mealOnThisDay = await FOOD.find({user:userId,day})

        if(mealOnThisDay >= 3){
            return next(new customError(`You already have 3 meals on ${day}. Remove one to add a new meal`, 400))
        }

        // check if the mealperiod is not being duplicated
        const mealPeriodTaken = mealOnThisDay.some(meal => meal.mealPeriod === mealPeriod)
         if (mealPeriodTaken) {
            return next(new customError(`You already have a ${mealPeriod} meal on ${day}`, 400))
        }

        await FOOD.create({
            user:userId,
            name,
            day,
            mealPeriod
        })

        return res.status(201).json({
            success:true,
            message:"New meal added"
        })
        
    } catch (error) {
        console.log("CATCH ERROR:", error)
        return next(error)
    }

}

const handleGetAllFoods = async(req,res,next)=>{
    const userId = req.user._id
    if(!userId){
        return next(new customError("un-authorizied user",400))
    }
    try {
        const allMeals = await FOOD.find({user:userId})
         if (!allMeals.length) {
            return next(new customError("No meals yet", 404))
        }

        return res.status(200).json({
            success:true,
            message:"all meals",
            allMeals
        })
        
    } catch (error) {
        return next(error)
    }
}

module.exports = {handleCreateFood,handleGetAllFoods}