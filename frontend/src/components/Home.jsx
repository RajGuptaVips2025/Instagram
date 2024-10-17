import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import SuggestedUsers from './SuggestedUsers';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setSavedPosts, setFollowing, setFollower, setSelectedPost } from '../features/userDetail/userDetailsSlice'; // Adjust paths as necessary
import PostComment from './PostComment';
import Post from './Post';
import Stories from './Stories';
import { InstagramSkeletonComponent } from './instagram-skeleton';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [open, setOpen] = useState(false)
  const savedPosts = useSelector((state) => state.counter.savedPosts);
  const [followingUserss, setFollowingUserss] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const userDetails = useSelector((state) => state.counter.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const { data: posts } = await axios.get('/api/posts/getPosts');
      setAllPosts(posts.reverse());
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching posts:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')
      setIsLoading(false)
    }

  };

  useEffect(() => {
    fetchPosts();
    getFollowing();
    getSavePosts();
  }, [setAllPosts, setFollowingUserss, open]);

  const handleLike = async (e, postId) => {
    e.preventDefault();
    const userId = userDetails.id;

    try {
      await axios.put(`/api/posts/${postId}/like`, { userId });
    } catch (error) {
      console.error('Error liking the post:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')
    } finally {
      fetchPosts();
    }
  };

  const handleSavePosts = async (e, postId) => {
    e.preventDefault();
    const userId = userDetails.id;

    try {
      const { data: { savedPosts } } = await axios.put(`/api/posts/${userId}/save`, { postId });
      dispatch(setSavedPosts(savedPosts));
    } catch (error) {
      console.error('Error saving the post:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')

    } finally {
      fetchPosts();
    }
  };

  const getSavePosts = async () => {
    const userId = userDetails.id;

    try {
      const { data: { savedPosts } } = await axios.get(`/api/posts/${userId}/save`);
      dispatch(setSavedPosts(savedPosts));
    } catch (error) {
      console.error('Error saving the post:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')

    } finally {
      fetchPosts();
    }
  };

  const showComments = (e, post) => {
    e.preventDefault();
    setOpen(true)
    dispatch(setSelectedPost(post));
  };

  const getFollowing = async () => {
    const response = await axios.get(`/api/users/${userDetails.id}/following`)
    const following = response.data.following
    dispatch(setFollowing([...following]));
    setFollowingUserss(following)
  }

  const handleFollowing = async (e, followingID) => {
    e.preventDefault();
    const userId = userDetails.id;
    try {
      const { data: { following, followers } } = await axios.put(`/api/users/${userId}/following`, { followingID });
      dispatch(setFollowing(following));
      dispatch(setFollower(followers));
      setFollowingUserss(following);
    } catch (error) {
      console.error('Error following/unfollowing the user:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')

    } finally {
      fetchPosts();
    }
  };

  const handleCommentSubmit = async (e, postId, comment) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`/api/posts/${postId}/comment`, {
        userId: userDetails.id,
        text: comment,
      });

      fetchPosts(); // Refresh posts to show the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')
    }
  };

  return (<div className='dark:bg-neutral-950 dark:text-white'>

    {/* { isLoading && <InstagramSkeletonComponent/> } */}

    <div className="flex bg-white dark:bg-neutral-950">
      <Sidebar />
      <PostComment open={open} setOpen={setOpen} func={fetchPosts} />
      <main className="flex-1 ml-64 flex justify-center">
        <div className="max-w-2xl w-full py-3 px-4">
          <Stories />
          {/* Posts */}
          <section className="mt-2 mx-auto w-[100vw] sm:w-[80vw] md:w-[60vw] lg:w-[468px]">
            {allPosts.map((post) => (
              <Post
                key={post._id}
                post={post}
                userDetails={userDetails}
                savedPost={savedPosts}
                followingUserss={followingUserss}
                handleLike={handleLike}
                handleSavePosts={handleSavePosts}
                showComments={showComments}
                handleFollowing={handleFollowing}
                handleCommentSubmit={handleCommentSubmit}
              />
            ))}
          </section>
        </div>
        <SuggestedUsers />
      </main>
    </div>
  </div>

  );
};

export default Home;