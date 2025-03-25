import express from "express";
import {
  UserLogin,
  UserRegister,
  addWorkout,
  getUserDashboard,
  getWorkoutsByDate,
  updateProfile,
  getProfile,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Endpoint to handle CSV step data upload
router.post("/upload-steps", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      try {
        // Save to MongoDB (example schema)
        const stepData = results.map((row) => ({
          user: req.user.id, // From JWT auth
          steps: row.Steps,
          distance: row.Distance, // km
          calories: row.Calories,
          date: new Date(row.Date),
        }));

        await Workout.insertMany(stepData);
        fs.unlinkSync(req.file.path); // Delete temp file
        res.status(200).json({ success: true });
      } catch (err) {
        res.status(500).json({ error: "Database error" });
      }
    });
});

// Endpoint to fetch step data for frontend
router.get("/step-data", verifyToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await Workout.findOne({
      user: req.user.id,
      date: { $gte: today },
    }).sort({ date: -1 });

    res.status(200).json(
      data || {
        steps: 0,
        distance: 0,
        calories: 0,
        lastUpdated: "No data today",
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch step data" });
  }
});

// Add this new endpoint
router.post("/save-steps", verifyToken, async (req, res) => {
  try {
    const { steps, distance, calories, date } = req.body;
    
    // Save to MongoDB
    const newEntry = new Workout({
      user: req.user.id,
      steps,
      distance,
      calories,
      date: new Date(date)
    });

    await newEntry.save();
    res.status(201).json({ success: true });

  } catch (err) {
    res.status(500).json({ error: "Failed to save steps" });
  }
});

// User authentication routes
router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

// Workout-related routes
router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);

// Profile-related routes
router.put("/profile", verifyToken, updateProfile);
router.get("/profile", verifyToken, getProfile);

export default router;
