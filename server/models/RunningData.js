import mongoose from 'mongoose';

const RunningDataSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true, 
    index: true 
  },
  steps: { 
    type: Number, 
    default: 0 
  },
  distance: { 
    type: Number, 
    default: 0 
  },
  calories: { 
    type: Number, 
    default: 0 
  },
}, { 
  timestamps: true 
});

// Ensure one entry per user per day
RunningDataSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('RunningData', RunningDataSchema);