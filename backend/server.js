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
import chatRoutes from './routes/chat.routes.js';
import adminRoutes from './routes/admin.routes.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';

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
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

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
      const { senderId, recipientId, text, fileUrl } = data;

      // Find or create conversation
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });
      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, recipientId],
        });
      }

      // Persist message
      const newMessage = await Message.create({
        conversationId: conversation._id,
        sender: senderId,
        text: text || undefined,
        fileUrl: fileUrl || undefined,
      });

      // Update conversation lastMessage
      conversation.lastMessage = {
        text: text || (fileUrl ? 'Attachment' : ''),
        sender: senderId,
        createdAt: new Date(),
      };
      await conversation.save();

      const messagePayload = {
        _id: newMessage._id,
        conversationId: conversation._id,
        sender: senderId,
        text: newMessage.text,
        fileUrl: newMessage.fileUrl,
        isRead: false,
        timestamp: newMessage.createdAt,
      };

      // Emit message to recipient and sender
      io.to(recipientId).emit('newMessage', messagePayload);
      io.to(senderId).emit('newMessage', messagePayload);
    } catch (error) {
      console.error('❌ Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Mark messages as read for a conversation
  socket.on('markAsRead', async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId, sender: { $ne: userId }, isRead: false },
        { $set: { isRead: true } }
      );
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
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