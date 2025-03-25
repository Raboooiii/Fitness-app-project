// server/controllers/Leaderboard.js
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { createError } from "../error.js";

export const getDailyLeaderboard = async (req, res, next) => {
  try {
    // Get start of current day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Aggregate user XP (calories burned today)
    const leaderboard = await User.aggregate([
      {
        $lookup: {
          from: "workouts",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$user", "$$userId"] },
                    { $gte: ["$date", today] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalCalories: { $sum: "$caloriesBurned" }
              }
            }
          ],
          as: "workouts"
        }
      },
      {
        $addFields: {
          dailyXP: { $ifNull: [{ $arrayElemAt: ["$workouts.totalCalories", 0] }, 0] }
        }
      },
      {
        $project: {
          name: 1,
          img: 1,
          dailyXP: 1,
          streak: 1,
          lastActive: 1
        }
      },
      { $sort: { dailyXP: -1 } },
      { $limit: 50 }
    ]);

    res.status(200).json(leaderboard);
  } catch (err) {
    next(err);
  }
};