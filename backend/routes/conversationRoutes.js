// const express = require('express');
// const { sendMessage, getFriends, getAllMessages } = require('../controllers/conversationController');
// const router = express.Router();

// router.post('/send/message/:id', sendMessage);
// router.get('/followingUsers/:username', getFriends);
// router.get('/all/messages/:id', getAllMessages);

// module.exports = router;



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
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');

// Routes for individual chat
router.post('/send/message/:id', upload.single('media'), authMiddleware, sendMessage);  // Send message to individual user
router.get('/followingUsers/:username', getFriends);  // Get the list of friends/following users
router.get('/all/messages/:id', getAllMessages);  // Get all messages with a user

// Routes for group chat
router.post('/group/create', createGroupChat);  // Create a new group chat
router.post('/group/send/message/:groupId', upload.single('media') , sendGroupMessage);  // Send a message in a group chat
router.get('/group/messages/:groupId', getGroupMessages);  // Get all messages from a group chat
router.put('/group/add/member/:groupId', addMemberToGroup);  // Add a new member to the group
router.put('/group/remove/member/:groupId', removeMemberFromGroup);  // Remove a member from the group
router.get('/groups/:userId', getUserGroups);  // Remove a member from the group

module.exports = router;
