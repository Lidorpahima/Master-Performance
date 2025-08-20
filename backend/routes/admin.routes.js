import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

router.post('/users', adminAuth, async (req, res) => {
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



export default router;
