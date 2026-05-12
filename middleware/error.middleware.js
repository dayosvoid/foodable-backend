
const errorHandling = (err,req,res,next)=>{
    let statusCode = err.statusCode || 500 
    let message = err.message || "internal server error"

    // incase user input an already existing email whhile registering
    if(err.code === 11000){
        statusCode = 400;
        message = "Email address already exist. please login"
    }

    // Handle Mongoose Validation Errors (missing fields in schema)
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }

    console.error(`[Error] ${req.method} ${req.url} - ${message}`)


    if (err.isOperational) {
        return res.status(statusCode).json({
            success: false,
            status: statusCode,
            message: message
        });
    }

    // Unknown/unexpected bug — log the real error but hide details from client
    console.error("UNEXPECTED ERROR 💥", err);
    return res.status(500).json({
        success: false,
        status: 500,
        message: "Something went wrong. Please try again later."
    });
}

module.exports = errorHandling 