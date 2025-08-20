import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import TuningProject from '../models/TuningProject.js';
import Vehicle from '../models/Vehicle.js';
import { upload, uploadToCloudinary, deleteFromCloudinary } from '../services/fileUploadService.js';

const router = express.Router();

// Customer uploads a tune file
router.post('/upload-file', auth, upload.single('file'), async (req, res) => {
  try {
    const { vehicleId, description } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Upload file to Cloudinary
    const folder = `tuning-files/${req.user.userId}`;
    const uploadResult = await uploadToCloudinary(file, folder);
    
    // Create a new tuning project
    const project = new TuningProject({
      vehicle: vehicleId,
      targetStage: 'stage1', // Default or from request
      status: 'pending',
      notes: description,
      originalFileUrl: uploadResult.url,
      originalFilePublicId: uploadResult.publicId,
      fileName: file.originalname,
      createdAt: new Date()
    });
    
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Admin uploads the tuned file for customer
router.post('/projects/:id/result-file', auth, adminAuth, upload.single('file'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get the project
    const project = await TuningProject.findById(projectId).populate('vehicle');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Upload file to Cloudinary
    const folder = `tuning-results/${project.vehicle.owner}`;
    const uploadResult = await uploadToCloudinary(file, folder);
    
    // If there's an existing result file, delete it
    if (project.resultFilePublicId) {
      await deleteFromCloudinary(project.resultFilePublicId);
    }
    
    // Update the project with the result file
    project.resultFileUrl = uploadResult.url;
    project.resultFilePublicId = uploadResult.publicId;
    project.resultFileName = file.originalname;
    project.status = 'completed';
    
    await project.save();
    res.json(project);
  } catch (error) {
    console.error('Result file upload error:', error);
    res.status(500).json({ message: 'Result file upload failed' });
  }
});

// Get user's tuning projects
router.get('/user-projects', auth, async (req, res) => {
  try {
    // Find all vehicles owned by the user
    const vehicles = await Vehicle.find({ owner: req.user.userId });
    const vehicleIds = vehicles.map(v => v._id);
    
    // Find all projects for those vehicles
    const projects = await TuningProject.find({ vehicle: { $in: vehicleIds } })
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Admin gets all tuning projects
router.get('/admin/projects', auth, adminAuth, async (req, res) => {
  try {
    const projects = await TuningProject.find()
      .populate('vehicle')
      .sort({ createdAt: -1 });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

// Update project status
router.patch('/projects/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const project = await TuningProject.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: 'Status update failed' });
  }
});

export default router;