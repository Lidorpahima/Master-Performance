import express from "express";
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models and routes
import authRoutes from './routes/auth.routes.js';
import vehicleRoutes from './routes/vehicle.routes.js';
import tuningRoutes from './routes/tuning.routes.js';
import chatRoutes from './routes/chat.routes.js';
import adminRoutes from './routes/admin.routes.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import User from './models/User.js'; // Make sure User model is imported

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

// --- CORRECTED Socket.IO event handlers ---
io.on('connection', async (socket) => { // This function now wraps all socket events
  console.log('🔌 User connected:', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    // 1. Join user to their personal room
    socket.join(userId);
    console.log(`👤 User ${userId} joined room ${userId}`);

    // 2. If user is an admin, also join them to the 'admins' room
    try {
      const user = await User.findById(userId);
      if (user && user.role === 'admin') {
        socket.join('admins');
        console.log(`👑 Admin ${userId} joined the 'admins' room`);
      }
    } catch (error) {
      console.error('Error finding user for admin room check:', error);
    }
  }

  // Handle incoming messages
  socket.on('sendMessage', async (data) => {
    try {
      console.log('📨 Message received:', data);
      const { senderId, recipientId, text, fileUrl, fileName, fileType } = data;

      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, recipientId],
        });
      }

      const recipient = await User.findById(recipientId).lean();
      if (!recipient) throw new Error('Recipient not found');

      // Persist message with file information
      const newMessage = await Message.create({
        conversationId: conversation._id,
        sender: senderId,
        text: text || undefined,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined,
        fileType: fileType || undefined,
      });

      // Update conversation lastMessage
      conversation.lastMessage = {
        text: text || (fileUrl ? `📎 ${fileName || 'File'}` : ''),
        sender: senderId,
        createdAt: new Date(),
      };
      await conversation.save();

      const fullNewMessage = await Message.findById(newMessage._id).lean();

      io.to(recipientId).emit('newMessage', fullNewMessage);
      io.to(senderId).emit('newMessage', fullNewMessage);
      console.log(`✉️  Message sent directly from ${senderId} to ${recipientId}${fileUrl ? ' with file' : ''}`);

      // Always send a copy back to the sender
      io.to(senderId).emit('newMessage', fullNewMessage);

    } catch (error) {
      console.error('❌ Error handling message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });


  // Mark messages as read for a conversation
  socket.on('markAsRead', async ({ conversationId, userId }) => {
    try {
      // Update messages as read
      const result = await Message.updateMany(
        { conversationId, sender: { $ne: userId }, isRead: false },
        { $set: { isRead: true } }
      );

      if (result.modifiedCount > 0) {
        // Get conversation participants to notify them
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          // Emit update to all participants in the conversation
          conversation.participants.forEach(participantId => {
            if (String(participantId) !== String(userId)) {
              io.to(String(participantId)).emit('messagesMarkedAsRead', {
                conversationId,
                markedBy: userId,
                count: result.modifiedCount
              });
            }
          });
        }
        
        console.log(`✅ Marked ${result.modifiedCount} messages as read in conversation ${conversationId} by user ${userId}`);
      }
    } catch (error) {
      console.error('❌ Error marking messages as read:', error);
      socket.emit('error', { message: 'Failed to mark messages as read' });
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