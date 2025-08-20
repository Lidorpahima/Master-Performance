import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  engineType: String,
  currentStage: {
    type: String,
    enum: ['stock', 'stage1', 'stage2', 'stage3'],
    default: 'stock',
  },
  modifications: [{
    type: String,
  }],
  performanceData: {
    horsepower: Number,
    torque: Number,
    zeroToSixty: Number,
  },
});

export default mongoose.model('Vehicle', vehicleSchema);
