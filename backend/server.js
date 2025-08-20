import express from "express";
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import tuningRoutes from './routes/tuning.routes.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tuning', tuningRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});