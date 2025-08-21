import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import TuningProject from '../models/TuningProject.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

const router = express.Router();

// List all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

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

// Update a user
router.put('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.password === 'string' && updateData.password.trim() !== '') {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
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
