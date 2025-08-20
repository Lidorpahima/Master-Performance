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
    const conversations = await Conversation.find({})
      .sort({ updatedAt: -1 })
      .populate('participants', 'firstName lastName _id');

    const results = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          isRead: false,
          sender: { $ne: adminId },
        });

        return {
          _id: conv._id,
          participants: conv.participants,
          lastMessage: conv.lastMessage,
          unreadCount,
        };
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

// GET /api/chat/messages/:otherUserId - get all messages between current user and other user. Create conversation if not exists
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

    if (!conversation) {
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
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const result = await uploadToCloudinary(req.file, 'chat_uploads');
    res.json({ fileUrl: result.url, fileName: req.file.originalname, fileType: req.file.mimetype });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed' });
  }
});

export default router;

