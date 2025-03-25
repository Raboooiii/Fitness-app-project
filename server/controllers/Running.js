import RunningData from '../models/RunningData.js';
import mongoose from 'mongoose';

export const getRunningData = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's data
    const todayData = await RunningData.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Get weekly data
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyData = await RunningData.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: weekAgo, $lte: today }
        }
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          steps: 1,
          distance: 1,
          calories: 1
        }
      },
      { $sort: { day: 1 } }
    ]);

    res.status(200).json({
      steps: todayData?.steps || 0,
      distance: todayData?.distance || 0,
      calories: todayData?.calories || 0,
      lastUpdated: todayData?.date?.toISOString() || "No data yet",
      weeklyData: weeklyData
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveRunningData = async (req, res) => {
  try {
    const { steps, distance, calories } = req.body;
    const userId = req.user.id;
    const date = new Date();

    const data = await RunningData.findOneAndUpdate(
      { 
        user: userId,
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)),
          $lt: new Date(date.setHours(23, 59, 59, 999))
        }
      },
      { 
        steps,
        distance,
        calories,
        date: new Date()
      },
      { 
        upsert: true,
        new: true
      }
    );

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWeeklyAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const data = await RunningData.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
          date: { $gte: weekAgo, $lte: today }
        }
      },
      {
        $project: {
          day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          steps: 1,
          distance: 1,
          calories: 1
        }
      },
      { $sort: { day: 1 } }
    ]);

    // Fill in missing days with zeros
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const found = data.find(d => d.day === dateStr) || {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        steps: 0,
        distance: 0,
        calories: 0
      };
      
      result.push(found);
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};