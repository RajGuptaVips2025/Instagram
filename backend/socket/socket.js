
const { Server } = require("socket.io");
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const userSocketMap = {};  // Maps userId to socketId
const groupRoomMap = {};   // Maps groupId to list of userIds (or just track membership in DB)

const getReciverSocketId = (reciverId) => userSocketMap[reciverId];

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit online users to all clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // User joins a group chat (groupRoom is like the group's unique ID)
  socket.on('joinGroup', ({ groupId }) => {
    socket.join(groupId);  // Join the group room
  });

  // Handle group message sending
  socket.on('sendGroupMessage', ({ groupId, senderId, message }) => {
    
    // Broadcast message to all users in the group
    io.to(groupId).emit('receiveGroupMessage', { senderId, message, groupId });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    if (userId && userSocketMap[userId] === socket.id) {  // Only delete if the disconnected socket matches
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

module.exports = { app, server, io, getReciverSocketId };
