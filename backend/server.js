import express from "express";
import cors from 'cors';
import { createServer } from 'http'; 
import { Server } from 'socket.io'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import tuningRoutes from './routes/tuning.routes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MongoDB connection string not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Route configuration
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/tuning', tuningRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Socket.IO configuration
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join user to their personal room
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
    console.log(`👤 User ${userId} joined room ${userId}`);
  }

  // Handle incoming messages
  socket.on('sendMessage', async (data) => {
    try {
      console.log('📨 Message received:', data);
      
      const { recipientId, ...messageData } = data;
      
      // Emit message to recipient
      io.to(recipientId).emit('newMessage', messageData);
      
      // Emit message back to sender for confirmation
      io.to(messageData.sender).emit('newMessage', messageData);
    } catch (error) {
      console.error('❌ Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDatabase();
    
    // Start HTTP server with Socket.IO
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});

// Start the server
startServer();