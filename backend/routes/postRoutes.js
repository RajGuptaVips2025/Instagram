const express = require('express');
const { createPost, getAllPosts, like, savePost, getComment, writeComment, getSavedPosts, removeComment } = require('../controllers/postController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', upload.array('media', 10), createPost); // Handle up to 10 files

router.get('/getPosts',authMiddleware , getAllPosts);
router.put('/:id/like',authMiddleware , like);
router.get('/:id/comment',authMiddleware , getComment);
router.put('/:id/save',authMiddleware , savePost);
router.get('/:id/save',authMiddleware , getSavedPosts);
router.post('/:id/comment',authMiddleware , writeComment);
router.delete('/:postId/comment/:commentId',authMiddleware , removeComment);

module.exports = router;
