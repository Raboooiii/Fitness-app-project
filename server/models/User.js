// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    bodyType: {
      type: String,
      enum: ["ectomorph", "mesomorph", "endomorph"],
    },
    fitnessExperience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    height: {
      type: Number, // Height in meters
    },
    weight: {
      type: Number, // Weight in kilograms
    },
    totalDays: {
      type: Number, // Total days using the app
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);