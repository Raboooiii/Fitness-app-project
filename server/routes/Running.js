import express from 'express';
import { 
  getRunningData,
  saveRunningData,
  getWeeklyAnalysis 
} from '../controllers/Running.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/data', verifyToken, getRunningData);
router.post('/data', verifyToken, saveRunningData);
router.get('/weekly', verifyToken, getWeeklyAnalysis);

export default router;