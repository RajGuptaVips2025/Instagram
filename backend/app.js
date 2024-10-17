const express = require('express');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const userRoutes = require('./routes/userRoutes'); // Updated userRoutes with reel history functionality
const conversationRoutes = require('./routes/conversationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const errorHandler = require('./middlewares/errorMiddleware');
const cors = require('cors');
const { server, app } = require('./socket/socket');
const path = require('path');
require('dotenv').config();

// Connect to database
connectDB();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT'], // Allowing GET, POST, and PUT
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes); // Now includes reel history functionality
app.use('/api/conversations', conversationRoutes);
app.use('/api/search', searchRoutes);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
