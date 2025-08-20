import express from 'express';
import vehicleRoutes from './vehicleRoutes.js';
import tuningRoutes from './tuningRoutes.js';
import userRoutes from './userRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

router.use('/vehicles', vehicleRoutes);
router.use('/tuning', tuningRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
