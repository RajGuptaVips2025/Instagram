const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  caption: { type: String, required: true },
  media: [{
    mediaType: { type: String, enum: ['image', 'video'], required: true },
    mediaPath: { type: String, required: true },
    imageWidth: Number,
    imageHeight: Number,
  }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    profilePicture: { type: String, default: 'uploads/defaultProfilePic.png' },
    text: { type: String },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
