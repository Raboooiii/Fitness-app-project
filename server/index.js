import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import bodyParser from "body-parser"; // Add this
import multer from "multer"; // Add this

dotenv.config();

const app = express();

// Middleware additions for file uploads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend requests
}));

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });
app.use(upload.any()); // Enable file uploads globally

// Routes
app.use("/api/user/", UserRoutes);

// Error handler (keep existing)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({ success: false, status, message });
});

// Database connection (keep existing)
const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

// Start server (keep existing)
const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => console.log("Server running on http://localhost:8080"));
  } catch (error) {
    console.log(error);
  }
};


startServer();
