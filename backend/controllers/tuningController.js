import TuningProject from '../models/TuningProject.js';
import { sendProjectUpdateEmail } from '../services/emailService.js';

export const createTuningProject = async (req, res) => {
  try {
    const project = new TuningProject({
      vehicle: req.body.vehicleId,
      customer: req.user.userId,
      targetStage: req.body.targetStage,
      status: 'pending',
      estimatedCompletion: req.body.estimatedCompletion,
      notes: req.body.notes,
      performanceGoals: {
        targetHorsepower: req.body.targetHorsepower,
        targetTorque: req.body.targetTorque
      }
    });

    await project.save();
    await sendProjectUpdateEmail(req.user, project);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { status, notes, completionDate } = req.body;
    const project = await TuningProject.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        notes,
        completionDate,
        'progressUpdates': [
          ...project.progressUpdates,
          { status, notes, date: new Date() }
        ]
      },
      { new: true }
    );
    await sendProjectUpdateEmail(project.customer, project);
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};