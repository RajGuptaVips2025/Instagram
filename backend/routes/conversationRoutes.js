const express = require('express');
const {
  sendMessage,
  getFriends,
  getAllMessages,
  createGroupChat,
  sendGroupMessage,
  getGroupMessages,
  addMemberToGroup,
  removeMemberFromGroup,
  getUserGroups
} = require('../controllers/conversationController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// Routes for individual chat
router.post('/send/message/:id',authMiddleware ,upload.single('media'), sendMessage);  // Send message to individual user
router.get('/followingUsers/:username',authMiddleware , getFriends);  // Get the list of friends/following users
router.get('/all/messages/:id',authMiddleware , getAllMessages);  // Get all messages with a user

// Routes for group chat
router.post('/group/create',authMiddleware , createGroupChat);  // Create a new group chat
router.post('/group/send/message/:groupId',authMiddleware ,upload.single('media') , sendGroupMessage);  // Send a message in a group chat
router.get('/group/messages/:groupId',authMiddleware , getGroupMessages);  // Get all messages from a group chat
router.put('/group/add/member/:groupId',authMiddleware , addMemberToGroup);  // Add a new member to the group
router.put('/group/remove/member/:groupId',authMiddleware , removeMemberFromGroup);  // Remove a member from the group
router.get('/groups/:userId',authMiddleware , getUserGroups);  // Remove a member from the group

module.exports = router;
