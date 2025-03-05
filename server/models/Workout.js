import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema({
  workoutName: {
    type: String,
    required: true, // No unique constraint
  },
  category: {
    type: String,
    required: true,
  },
  sets: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},
  { timestamps: true }
);

export default mongoose.model("Workout", WorkoutSchema);