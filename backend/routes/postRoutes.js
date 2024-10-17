const express = require('express');
const { createPost, getAllPosts, like, savePost, getComment, writeComment, getSavedPosts, removeComment } = require('../controllers/postController');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.post('/create', upload.single('media'), createPost);
router.get('/getPosts', getAllPosts);
router.put('/:id/like', like);
router.get('/:id/comment', getComment);
router.put('/:id/save', savePost);
router.get('/:id/save', getSavedPosts);
router.post('/:id/comment', writeComment);
router.delete('/:postId/comment/:commentId', removeComment);

module.exports = router;
