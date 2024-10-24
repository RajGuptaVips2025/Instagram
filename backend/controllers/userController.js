const User = require('../models/userSchema');
const Post = require('../models/postSchema');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary


const getUserAndPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 0; // Default page to 0 if not provided
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ author: user._id })
      .skip(page * limit).limit(limit)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username');

    res.json({ user, posts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const following = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const followingUser = await User.findById(req.body.followingID);
    if (!user.following.includes(req.body.followingID)) {
      user.following.push(req.body.followingID);
    } else {
      user.following.pull(req.body.followingID);
    }
    if (!followingUser.followers.includes(req.params.id)) {
      followingUser.followers.push(req.params.id);
    } else {
      followingUser.followers.pull(req.params.id);
    }
    await user.save();
    await followingUser.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from the request parameters
    const { username, name, bio } = req.body; // Assume these fields are being updated
    let updateData = { username, name, bio };
    // Check if a new profile image is uploaded
    let result; // Declare result outside the try block

    if (req.file) {
      // Update the profile image field
      try {
        result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'posts',
          resource_type: 'auto', // Automatically determine resource type (image, video, etc.)
        });
      } catch (error) {
        console.error('Cloudinary upload failed:', error.message);
        return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
      }
      updateData.profilePicture = result.secure_url;
    }

    // Find the user and update the specified fields
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document and validate the changes
    ).select('-password'); // Exclude the password field from the returned document

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the profile', error: error.message });
  }
};


const addToReelHistory = async (req, res) => {
  try {
    const { userId, postId } = req.params; // Get userId and postId from request params

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.reelHistory.push({
      postId,
      watchedAt: new Date()
    });

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Reel added to history successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


getUserDashboard = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });
    // console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all reels (posts) by this user
    const reels = await Post.find({ author: user._id });
    console.log(reels);

    // Initialize arrays for likes, comments, and views IDs
    const totalLikes = [];
    const totalComments = [];
    const totalViews = [];

    // Calculate total likes, comments, and views while storing IDs
    reels.forEach(reel => {
      // console.log(reel)
      if (reel.likes.length > 0) {
        totalLikes.push(reel._id); // Store reel ID if it has likes
      }
      if (reel.comments.length > 0) {
        totalComments.push(reel._id); // Store reel ID if it has comments
      }
      if (reel.views > 0) {
        totalViews.push(reel._id); // Store reel ID if it has views
      }
    });

    // Prepare response data
    const responseData = {
      totalLikes: totalLikes.length, // Number of total likes
      totalComments: totalComments.length, // Number of total comments
      totalViews: totalViews.length, // Number of total views
      reels
      // reels: reels.map(reel => ({
      //   _id: reel._id,
      //   thumbnail: reel.thumbnail,
      //   likes: reel.likes,
      //   comments: reel.comments,
      //   views: 10,
      //   // caption
      // })),
    };

    return res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Define other controller methods here...

module.exports = { getUserAndPosts, getFollowing, following, updateProfile, addToReelHistory, getUserDashboard };
