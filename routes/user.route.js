const express = require("express")
const route = express.Router()
const tokenVerification = require("../middleware/Auth.middleware")
const {handleRegister,handleLogin,handleLogout} = require('../controller/user.controller')

route.post("/register", handleRegister)
route.post("/login", handleLogin)
route.post("/logout" , tokenVerification, handleLogout)

module.exports = route