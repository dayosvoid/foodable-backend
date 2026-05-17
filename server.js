const express = require("express");
const app = express();
const mongoose = require("mongoose");
const errorHandling = require("./middleware/error.middleware");
const CustomError = require("./utils/customError");
const cors = require("cors"); // Import #1 kept cleanly here

const userRoute = require('./routes/user.route');
const foodRoute = require('./routes/food.route');

const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 2000;

app.use(express.json());

// Create a checklist of explicit domains
const allowedOrigins = [
  "https://foodable-frontend-ashen.vercel.app",
  process.env.FONTEND_URL // matching your .env spelling
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow local tools like Postman or server-to-server calls
    if (!origin) return callback(null, true);

    // Clean up the string to prevent hidden spaces from breaking matches
    const sanitizedOrigin = origin.trim();

    const isExplicitlyAllowed = allowedOrigins.includes(sanitizedOrigin);
    const isVercelPreview = sanitizedOrigin.endsWith(".vercel.app");

    if (isExplicitlyAllowed || isVercelPreview) {
      // Approve the request and reflect the exact origin back to the browser
      return callback(null, true);
    } else {
      // Log to your Render dashboard exactly what domain was blocked
      console.warn(`[CORS Blocked]: ${sanitizedOrigin} tried to access the API.`);
      return callback(null, false);
    }
  },
  credentials: true
}));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Foodable API is running' })
});

app.use("/api/foodable/food", foodRoute);
app.use("/api/foodable/user", userRoute);

// Fixed standard Express fallback for 404s
app.use((req, res, next) => {
    next(new CustomError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandling);

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`app is listen ${PORT} and as connected to db`);
        });
    } catch (error) {
        console.error("Error starting server:", error.message);
        process.exit(1);
    }
};

startServer();