const route = require("express").Router()
const tokenVerification = require("../middleware/Auth.middleware")
const {handleCreateFood,handleGetAllFoods,handleUpdateMeal, handleDeleteMeal} = require("../controller/food.controller")

route.post("/create",tokenVerification,handleCreateFood)
route.get("/getAll", tokenVerification ,handleGetAllFoods)
route.patch("/Update/:id", tokenVerification, handleUpdateMeal)
route.delete("/delete/:id",tokenVerification,handleDeleteMeal)
module.exports = route