const FOOD = require("../model/food.schema")
const USER =  require("../model/user.Schema")
const customError  = require("../utils/customError")

const handleCreateFood = async(req,res,next)=>{
    // console.log("hitting route")
     console.log("req.body:", req.body)
    const {name,day,mealPeriod} = req.body
    const userId = req.user._id 

    const isMissing = (val) => val === undefined || val === null || val === ""

        if (isMissing(name) || isMissing(day) || isMissing(mealPeriod)) {
            return next(new customError("All fields are required", 400))
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

        if(mealOnThisDay.length >= 3){
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
        const allMeals = await FOOD.find({user:userId}).sort({ day: 1 }) 
         if (!allMeals.length) {
            return next(new customError("No meals yet", 404))
        }

        const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const sortedMeals = allMeals.sort((a,b)=>dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))

        return res.status(200).json({
            success:true,
            message:"All meals",
            allMeals:sortedMeals
        })
        
    } catch (error) {
        return next(error)
    }
}

const handleUpdateMeal = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id
    const { name, day, mealPeriod } = req.body

    try {
        const meal = await FOOD.findOne({ _id: id, user: userId })
        if (!meal) {
            return next(new customError("Meal not found", 404))
        }

        const updatedMeal = await FOOD.findOneAndUpdate(
            { _id: id, user: userId },
            { name, day, mealPeriod },
            { new: true, runValidators: true }
        )

        return res.status(200).json({
            success: true,
            message: "Meal updated",
            updatedMeal
        })
    } catch (error) {
        return next(error)
    }
}

const handleDeleteMeal = async (req, res, next) => {
    const { id } = req.params
    const userId = req.user._id

    if (!id) {
        return next(new customError("Invalid request", 400))
    }

    try {
        const deletedMeal = await FOOD.findOneAndDelete({ _id: id, user: userId })

        if (!deletedMeal) {
            return next(new customError("Meal does not exist", 404))
        }

        return res.status(200).json({
            success: true,
            message: "Meal has been removed"
        })
    } catch (error) {
        return next(error)
    }
}

module.exports = {handleCreateFood,handleGetAllFoods,handleUpdateMeal,handleDeleteMeal}