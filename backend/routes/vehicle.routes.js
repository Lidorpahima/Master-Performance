import express from 'express';
import { auth } from '../middleware/auth.js';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
 console.log(req.body,"hey there");
 
  try {
    const vehicle = new Vehicle({
      ...req.body,
       owner: req.user.userId
    });
    console.log(vehicle);
    
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: 'Vehicle creation failed' });
  }
});

router.get('/user-vehicles', auth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.userId });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      req.body,
      { new: true }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
});

export default router;