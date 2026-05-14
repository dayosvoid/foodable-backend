const express = require("express")
const app = express()
const mongoose = require("mongoose")
const errorHandling = require("./middleware/error.middleware")
const CustomError = require("./utils/customError")
const cors = require("cors")

const userRoute = require('./routes/user.route')
const foodRoute = require('./routes/food.route')

const dotenv = require("dotenv")
dotenv.config()
PORT = process.env.PORT || 2000

app.use(express.json())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:"true"
}))
app.use("/api/foodable/food", foodRoute)
app.use("/api/foodable/user", userRoute)

app.use('/{*path}', (req, res, next) => {
    next(new CustomError(`Can't find ${req.url} on this server`, 404))
})


app.use(errorHandling)



const startServer =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        app.listen(PORT,()=>{
            console.log(`app is listen ${PORT} and as connected to db`)
        })
    } catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1)
    }
}

startServer()