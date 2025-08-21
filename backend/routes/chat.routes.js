import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../services/fileUploadService.js';

const router = express.Router();

// GET /api/chat/conversations (admin only): list all conversations with participants and last message + unread count
router.get('/conversations', auth, adminAuth, async (req, res) => {
  try {
    const adminId = req.user.id || req.user._id;

    // 1. Fetch all customers (users who are not admins)
    const customers = await User.find({ role: { $ne: 'admin' } })
      .select('firstName lastName _id')
      .lean(); // .lean() for better performance

    // 2. Fetch all conversations the admin is part of
    const conversations = await Conversation.find({ participants: adminId })
      .populate('participants', 'firstName lastName _id')
      .sort({ updatedAt: -1 });

    // 3. Create a map for quick lookup of conversations by customer ID
    const conversationsMap = new Map();
    await Promise.all(
      conversations.map(async (conv) => {
        const otherParticipant = conv.participants.find(p => String(p._id) !== String(adminId));
        if (otherParticipant) {
          const unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            isRead: false,
            sender: otherParticipant._id,
          });
          
          conv.unreadCount = unreadCount;
          conversationsMap.set(String(otherParticipant._id), conv);
        }
      })
    );

    // 4. Merge the two lists
    const results = customers.map((customer) => {
      const existingConv = conversationsMap.get(String(customer._id));
      if (existingConv) {
        // A conversation exists for this customer
        const other = existingConv.participants.find(p => String(p._id) !== String(adminId));
        return {
          _id: existingConv._id, // The conversation ID
          otherUserId: other._id,
          name: `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'User',
          participants: existingConv.participants,
          lastMessage: existingConv.lastMessage,
          unreadCount: existingConv.unreadCount,
        };
      } else {
        // No conversation exists yet, create a placeholder
        return {
          _id: customer._id, // Use customer ID as a temporary key
          otherUserId: customer._id,
          name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'User',
          participants: [req.user, customer], // For display purposes
          lastMessage: { text: 'Click to start a conversation' },
          unreadCount: 0,
        };
      }
    });

    // Sort to show users with recent activity first
    results.sort((a, b) => {
        const aDate = a.lastMessage?.createdAt || 0;
        const bDate = b.lastMessage?.createdAt || 0;
        if (bDate && aDate) return new Date(bDate) - new Date(aDate);
        return 0;
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

// GET /api/chat/messages/:otherUserId - get all messages between current user and other user.
// For non-admin users, DO NOT create a new conversation automatically.
router.get('/messages/:otherUserId', auth, async (req, res) => {
  try {
    const currentUserId = req.user.id || req.user._id;
    const { otherUserId } = req.params;

    // If current user is not admin, enforce that otherUser is admin
    if (req.user.role !== 'admin') {
      const other = await User.findById(otherUserId);
      if (!other || other.role !== 'admin') {
        return res.status(403).json({ message: 'Customers may only chat with admin' });
      }
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] },
    });

    // Only admins may implicitly create a new conversation from this endpoint
    if (!conversation) {
      if (req.user.role !== 'admin') {
        return res.status(404).json({ message: 'Conversation not available yet. Support will reach out to you.' });
      }
      conversation = await Conversation.create({
        participants: [currentUserId, otherUserId],
        lastMessage: {},
      });
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });

    res.json({ conversationId: conversation._id, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// POST /api/chat/start/:userId (admin only) - ensure a conversation exists with a specific user
router.post('/start/:userId', auth, adminAuth, async (req, res) => {
  try {
    const adminId = req.user.id || req.user._id;
    const { userId } = req.params;

    let conversation = await Conversation.findOne({
      participants: { $all: [adminId, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [adminId, userId],
        lastMessage: {},
      });
    }

    res.json({ conversationId: conversation._id });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({ message: 'Failed to start conversation' });
  }
});

// GET /api/chat/default-admin - pick a default admin for customers
router.get('/default-admin', auth, async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('_id firstName lastName');
    if (!admin) {
      return res.status(404).json({ message: 'No admin found' });
    }
    res.json({ _id: admin._id, name: `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || 'Admin' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch default admin' });
  }
});

// POST /api/chat/upload - secure file upload to Cloudinary
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('--- UPLOAD DEBUG START ---');
    console.log('Cloudinary Cloud Name Loaded:', !!process.env.CLOUDINARY_CLOUD_NAME);
    console.log('Cloudinary API Key Loaded:', !!process.env.CLOUDINARY_API_KEY);
    console.log('Cloudinary API Secret Loaded:', !!process.env.CLOUDINARY_API_SECRET ? 'Yes' : 'NO - THIS IS LIKELY THE PROBLEM');
    
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary environment variables are missing!');
      return res.status(500).json({ message: 'Upload service is not configured on the server.' });
    }

    if (!req.file) {
      console.error('❌ No file was received by the server.');
      return res.status(400).json({ message: 'No file provided' });
    }
    console.log(`✅ File received on server: ${req.file.originalname}, Size: ${req.file.size} bytes`);

    console.log('Attempting to upload to Cloudinary...');
    const result = await uploadToCloudinary(req.file, 'chat_uploads');
    
    console.log('✅ Upload to Cloudinary successful!');
    console.log('--- UPLOAD DEBUG END ---');
    
    return res.json({ fileUrl: result.url, fileName: req.file.originalname, fileType: req.file.mimetype });

  } catch (error) {
    console.error('❌ A critical error occurred during the upload process:', error);
    console.log('--- UPLOAD DEBUG END ---');
    return res.status(500).json({ message: 'Upload failed', error: error?.message || 'An unknown error occurred' });
  }
});
export default router;

