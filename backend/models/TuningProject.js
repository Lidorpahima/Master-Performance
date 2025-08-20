import mongoose from 'mongoose';

const tuningProjectSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  targetStage: {
    type: String,
    enum: ['stage1', 'stage2', 'stage3'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  price: Number,
  estimatedCompletion: Date,
  notes: String,
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  originalFileUrl: String,
  originalFilePublicId: String,
  fileName: String,
  resultFileUrl: String,
  resultFilePublicId: String,
  resultFileName: String,
  adminNotes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('TuningProject', tuningProjectSchema);