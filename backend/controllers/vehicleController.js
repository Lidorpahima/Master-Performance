import Vehicle from '../models/Vehicle.js';
import { uploadToS3 } from '../services/fileUploadService.js';

export const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({
      ...req.body,
      owner: req.user.userId,
      performanceData: {
        horsepower: req.body.horsepower || 0,
        torque: req.body.torque || 0
      }
    });

    if (req.file) {
      const imageUrl = await uploadToS3(req.file, 'vehicles');
      vehicle.image = imageUrl;
    }

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePerformanceData = async (req, res) => {
  try {
    const { horsepower, torque, zeroToSixty } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          'performanceData.horsepower': horsepower,
          'performanceData.torque': torque,
          'performanceData.zeroToSixty': zeroToSixty
        }
      },
      { new: true }
    );
    res.json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
