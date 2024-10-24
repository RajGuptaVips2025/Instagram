const Conversation = require('../models/conversationSchema');
const Message = require('../models/messageSchema');
const User = require('../models/userSchema');
const GroupChat = require('../models/groupChatSchema')
const cloudinary = require('../config/cloudinary')
const { getReciverSocketId, io } = require('../socket/socket');
const { encrypt, decrypt } = require("../config/crypto");
const crypto = require('crypto');


// For individual message sending
// const sendMessage = async (req, res) => {
//   try {
//     const { textMessage: message, senderId, messageType } = req.body;
//     const receiverId = req.params.id;

//     // Handle file upload (if exists)
//     let mediaUrl = '';
//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         resource_type: "auto",  // Automatically detects image or video
//       });
//       mediaUrl = result.secure_url;
//     }

//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     });

//     if (!conversation) {
//       conversation = await Conversation.create({
//         participants: [senderId, receiverId],
//       });
//     }

//     const newMessage = await Message.create({
//       senderId,
//       reciverId: receiverId,
//       message: messageType === 'text' ? message : undefined,
//       mediaUrl: messageType !== 'text' ? mediaUrl : undefined,
//       messageType,
//     });

//     conversation.messages.push(newMessage._id);
//     await conversation.save();

//     // Populate the new message with sender and receiver details
//     const populatedMessage = await Message.findById(newMessage._id)
//       .populate('senderId', 'username profilePicture') // Populate sender details
//       .populate('reciverId', 'username profilePicture'); // Populate receiver details

//     const receiverSocketId = getReciverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit('newMessage', populatedMessage);
//     }

//     res.status(200).json({ success: true, newMessage: populatedMessage });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

const sendMessage = async (req, res) => {
  try {
    const { textMessage: message, senderId, messageType } = req.body;
    const receiverId = req.params.id;

    // Generate a random IV
    let iv = crypto.randomBytes(16);

    // Encrypt the message
    const { iv: ivHex, encryptedData } = encrypt(message, iv);

    let mediaUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });
      mediaUrl = result.secure_url;
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      reciverId: receiverId,
      message: messageType === 'text' ? encryptedData : undefined,
      iv: messageType === 'text' ? ivHex : undefined,
      mediaUrl: messageType !== 'text' ? mediaUrl : undefined,
      messageType,
    });

    conversation.messages.push(newMessage._id);
    await conversation.save();

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'username profilePicture')
      .populate('reciverId', 'username profilePicture');

    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', populatedMessage);
    }

    res.status(200).json({ success: true, newMessage: populatedMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


// For getting friends of a user
const getFriends = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username })
      .populate({
        path: 'following',
        select: '-password'
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// const getAllMessages = async (req, res) => {
//   try {
//     const senderId = req.query.senderId;
//     const receiverId = req.params.id;

//     let conversation = await Conversation.findOne({
//       participants: { $all: [senderId, receiverId] }
//     }).populate({
//       path: 'messages',
//       populate: [
//         { path: 'senderId', select: 'username profilePicture' }, // Populate sender details
//         { path: 'reciverId', select: 'username profilePicture' }  // Populate receiver details (if necessary)
//       ]
//     });


//     if (!conversation) {
//       return res.status(201).json({ success: true, messages: [] });
//     }

//     return res.status(200).json({ success: true, messages: conversation.messages });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

const getAllMessages = async (req, res) => {
  try {
    const senderId = req.query.senderId;
    const receiverId = req.params.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate({
      path: 'messages',
      populate: [
        { path: 'senderId', select: 'username profilePicture' },
        { path: 'reciverId', select: 'username profilePicture' }
      ]
    });

    // console.log(conversation);

    if (!conversation) {
      return res.status(201).json({ success: true, messages: [] });
    }

    // Decrypt messages
    conversation.messages = conversation.messages.map(msg => {
      console.log(msg.messageType);
      if (msg.messageType === 'text') {
        msg.message = decrypt({
          iv: msg.iv,
          encryptedData: msg.message
        });
      }
      return msg;
    });

    return res.status(200).json({ success: true, messages: conversation.messages });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


const createGroupChat = async (req, res) => {
  try {
    const { groupName, members, groupImage, createdBy } = req.body;

    // Create the group chat
    const allMembers = [...members, { userId: createdBy, role: 'admin' }];

    const newGroupChat = await GroupChat.create({
      groupName,
      groupImage,
      members: allMembers,
      createdBy
    });

    allMembers.forEach(({ userId }) => {
      // Get the socket ID for this user
      const socketId = getReciverSocketId(userId);
      if (socketId) {
        // Emit a message to the specific user by their socket ID
        io.to(socketId).emit('groupCreated', {
          message: `You have been added to the group ${groupName}`,
          groupChat: newGroupChat
        });
      }
    });

    res.status(201).json({ success: true, groupChat: newGroupChat });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


const getUserGroups = async (req, res) => {
  try {
    const { userId } = req.params;

    const groups = await GroupChat.find({
      $or: [
        { "members.userId": userId }, // User is a member
        { createdBy: userId }         // User is the creator/admin
      ]
    }).populate({
      path: 'members.userId',
      select: 'fullName username' // Include fullName and username, exclude password
    }); // Exclude password field

    if (!groups) return res.status(401).json({ message: "not in any group" });


    res.status(200).json(groups);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// For send messages in the group
const sendGroupMessage = async (req, res) => {
  try {
    const { senderId, textMessage: message, messageType } = req.body;
    const groupId = req.params.groupId;

    let mediaUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });
      mediaUrl = result.secure_url;
    }

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ error: 'Group chat not found' });
    }

    const newMessage = {
      senderId,
      message: messageType === 'text' ? message : undefined,
      mediaUrl: messageType !== 'text' ? mediaUrl : undefined,
      messageType,
    };

    groupChat.messages.push(newMessage);
    groupChat.updatedAt = Date.now();

    await groupChat.save();

    // Emit the new message to all group members via socket.io
    const members = groupChat.members.map(member => member.userId.toString());
    members.forEach(memberId => {
      const memberSocketId = getReciverSocketId(memberId);
      if (memberSocketId) {
        io.to(memberSocketId).emit('sendGroupMessage', newMessage);
      }
    });

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all messages from a group chat
const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    const groupChat = await GroupChat.findById(groupId).populate('messages.senderId', 'username profilePicture');
    if (!groupChat) {
      return res.status(404).json({ error: 'Group chat not found' });
    }

    res.status(200).json({ success: true, messages: groupChat.messages });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a member to the group chat
const addMemberToGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { userId } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ error: 'Group chat not found' });
    }

    // Check if the user is already in the group
    const isMember = groupChat.members.some(member => member.userId.toString() === userId);
    if (isMember) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    groupChat.members.push({ userId });
    await groupChat.save();

    res.status(200).json({ success: true, message: 'Member added successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a member from the group chat
const removeMemberFromGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { userId } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ error: 'Group chat not found' });
    }

    groupChat.members = groupChat.members.filter(member => member.userId.toString() !== userId);
    await groupChat.save();

    res.status(200).json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  sendMessage,
  getFriends,
  getAllMessages,
  createGroupChat,
  sendGroupMessage,
  getGroupMessages,
  addMemberToGroup,
  removeMemberFromGroup,
  getUserGroups
};
