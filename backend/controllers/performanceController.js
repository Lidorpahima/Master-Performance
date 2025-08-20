import Performance from '../models/Performance.js';
import Vehicle from '../models/Vehicle.js';

export const recordPerformanceRun = async (req, res) => {
  try {
    const performance = new Performance({
      vehicle: req.body.vehicleId,
      metrics: {
        horsepower: req.body.horsepower,
        torque: req.body.torque,
        zeroToSixty: req.body.zeroToSixty,
        quarterMile: req.body.quarterMile
      },
      conditions: req.body.conditions,
      dynoResults: req.body.dynoResults
    });

    await performance.save();
    res.status(201).json(performance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
