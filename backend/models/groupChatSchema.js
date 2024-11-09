const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  groupImage: {
    type: String, default: 'uploads/groupProfile.jpeg'   // URL or path to the group's image
  },
  members: [
    {
      userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      joinedAt: { 
        type: Date, 
        default: Date.now 
      },
      role: {
        type: String, 
        enum: ['admin', 'member'], 
        default: 'member'
      }
    }
  ],
  messages: [
    {
      senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      message: {
        type: String
      },
      iv: { type: String },       
      messageType: {
        type: String,
        enum: ['text', 'image', 'video'],  // For future support of multimedia messages
        default: 'text'
      },
      mediaUrl: {
        type: String
      },
      timestamp: { 
        type: Date, 
        default: Date.now 
      }
    }
  ],
  iv: { type: String }, 
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GroupChat', groupChatSchema);