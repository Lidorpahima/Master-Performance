import mongoose from 'mongoose';
import Conversation from './Conversation.js';
import Message from './Message.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  firstName: String,
  lastName: String,
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre('remove', async function(next) {
  const userId = this._id;

  try {
    console.log(`User ${userId} is being deleted. Cleaning up related data...`);
    await Conversation.deleteMany({ participants: userId });
    await Message.deleteMany({ sender: userId });
    
    console.log(`Cleanup for user ${userId} completed successfully.`);
    next();
  } catch (error) {
    console.error(`Error during cleanup for user ${userId}:`, error);
    next(error); 
  }
});

export default mongoose.model('User', userSchema);
