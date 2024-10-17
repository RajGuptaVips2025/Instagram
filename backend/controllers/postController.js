const sizeOf = require('image-size');
const Post = require('../models/postSchema');
const User = require('../models/userSchema');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary
const fs = require('fs'); // To delete files after upload

const createPost = async (req, res) => {
  try {
    const { caption, author } = req.body;

    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    let result; // Declare result outside the try block

    try {
      result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'posts',
        resource_type: 'auto', // Automatically determine resource type (image, video, etc.)
      });
      // console.log('Cloudinary upload successful:', result);
    } catch (error) {
      console.error('Cloudinary upload failed:', error.message);
      return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
    }

    // Store the media URL and type in MongoDB
    const newPost = new Post({
      caption,
      mediaType: req.file.mimetype.startsWith('image') ? 'image' : 'video',
      mediaPath: result.secure_url, // Cloudinary URL from the result object
      author,
      imageWidth: result.width, // Width from the Cloudinary result
      imageHeight: result.height, // Height from the Cloudinary result
    });

    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.posts.push(newPost._id);
    await user.save();
    await newPost.save();

    // Remove the file from the server after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.status(201).json({ newPost });
  } catch (error) {
    console.error('Error creating post:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username profilePicture').populate('comments.user', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};



const like = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      post.likes.push(req.body.userId);
    } else {
      post.likes.pull(req.body.userId);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const getComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture'); // Include profilePicture

    // console.log(post);
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

// const getSavedPosts = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };


const getSavedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('savedPosts'); // Populate the saved posts with full details

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.savedPosts); // Return only the saved posts (with full post details)
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
