const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reciverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,  // Only for one-to-one chats
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupChat',
    required: false,  // Only for group chats
  },
  message: {
    type: String
  },
  iv: { type: String }, 
  mediaUrl: {
    type: String
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video'],  // Message types
    required: true,
    default: 'text',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Message', messageSchema);
