// const express = require('express');
// const { getUserAndPosts, getFollowing, following, updateProfile } = require('../controllers/userController');
// const upload = require('../middlewares/uploadMiddleware');
// const router = express.Router();

// router.get('/:username', getUserAndPosts);
// router.post('/edit/:id', upload.single('media'), updateProfile);
// router.get('/:id/following', getFollowing);
// router.put('/:id/following', following);

// module.exports = router;

const express = require('express');
const { getUserAndPosts, getFollowing, following, updateProfile, addToReelHistory } = require('../controllers/userController');
const upload = require('../middlewares/uploadMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/:username',authMiddleware, getUserAndPosts);
router.post('/edit/:id', upload.single('media'),authMiddleware, updateProfile);
router.get('/:id/following',authMiddleware, getFollowing);
router.put('/:id/following',authMiddleware, following);

// New route for adding a reel to the user's history
router.post('/reelHistory/:userId/:postId', addToReelHistory);

module.exports = router;
