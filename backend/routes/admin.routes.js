import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import TuningProject from '../models/TuningProject.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

router.post('/users', auth, adminAuth, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      ...req.body,
      password: hashedPassword
    });
    
    await user.save();
    
    const userResponse = { ...user._doc };
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', auth, adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalVehicles, totalProjects, unreadMessages, conversations] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments(),
      TuningProject.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Conversation.countDocuments(),
    ]);

    const projectsByStatusAgg = await TuningProject.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const projectsByStatus = projectsByStatusAgg.reduce((acc, cur) => {
      acc[cur._id] = cur.count;
      return acc;
    }, {});

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersLast7 = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({
      totals: {
        users: totalUsers,
        vehicles: totalVehicles,
        projects: totalProjects,
        conversations,
        unreadMessages,
      },
      projectsByStatus,
      newUsersLast7,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});



export default router;
