const sizeOf = require('image-size');
const Post = require('../models/postSchema');
const User = require('../models/userSchema');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary
const fs = require('fs'); // To delete files after upload
const { getReciverSocketId, io } = require('../socket/socket');


const createPost = async (req, res) => {
  try {
    const { caption, author } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const mediaDetails = [];

    // Loop through each uploaded file and upload to Cloudinary
    for (let file of req.files) {
      let result;
      try {
        result = await cloudinary.uploader.upload(file.path, {
          folder: 'posts',
          resource_type: 'auto',
        });
      } catch (error) {
        console.error('Cloudinary upload failed:', error.message);
        return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
      }

      mediaDetails.push({
        mediaType: file.mimetype.startsWith('image') ? 'image' : 'video',
        mediaPath: result.secure_url,
        imageWidth: result.width,
        imageHeight: result.height,
      });

      // Remove file from server after uploading
      fs.unlinkSync(file.path);
    }

    // Store post details in MongoDB
    const newPost = new Post({
      caption,
      media: mediaDetails, // Save multiple media objects
      author,
    });

    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.posts.push(newPost._id);
    await user.save();
    await newPost.save();

    res.status(201).json({ newPost });
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  
  try {
    const posts = await Post.find().skip(page * limit).limit(limit).populate('author', 'username profilePicture').populate('comments.user', 'username');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


const like = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(post.author);
    const likedUser = await User.findById(req.body.userId);
    let newObj = {};
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
      newObj = {
        likeType: 'like',
        id:user._id,
        username: likedUser.username,
        userPic: user.profilePicture
      };
    } else {
      post.likes.pull(req.body.userId);
      newObj = {
        likeType: 'dislike',
        id:user._id,
        username: user.username,
        userPic: user.profilePicture
      };
    }
    
    await post.save();
    
    const receiverSocketId = getReciverSocketId(post?.author);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('rtmNotification', newObj);
    } else {
      console.log('Receiver not connected to socket');
    }
    
    res.json({ post, newObj });
  } catch (error) {
    console.error('Error in like route:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


const getComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture'); // Include profilePicture

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const savePost = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user.savedPosts.includes(req.body.postId)) {
      user.savedPosts.push(req.body.postId);
    } else {
      user.savedPosts.pull(req.body.postId);
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const writeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.body.userId);
    post.comments.push({ user: req.body.userId, text: req.body.text, profilePicture: user.profilePicture });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const removeComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
      // Find the post by its ID and update it by removing the comment
      const post = await Post.findByIdAndUpdate(
          postId,
          { $pull: { comments: { _id: commentId } } }, // Assuming _id is the field for each comment
          { new: true } // To return the updated post
      ).populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');;

      if (!post) {
          return res.status(404).json({ message: 'Post not found' });
      }

      return res.status(200).json({ message: 'Comment removed successfully', post });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
  }
};

// Define other controller methods here...

module.exports = { createPost, getAllPosts, like, getComment, savePost, getSavedPosts, writeComment,removeComment };
