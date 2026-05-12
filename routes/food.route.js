const route = require("express").Router()
const tokenVerification = require("../middleware/Auth.middleware")
const {handleCreateFood,handleGetAllFoods} = require("../controller/food.controller")

route.post("/create",tokenVerification,handleCreateFood)
// route.get("/getAll",tokenVerification,handleGetAllFoods)

module.exports = route