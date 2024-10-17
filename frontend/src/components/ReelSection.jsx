import React, { useEffect, useState, useRef } from 'react';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { BsThreeDots } from "react-icons/bs";
import axios from 'axios';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedPosts, setWatchHistory } from '@/features/userDetail/userDetailsSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const ReelSection = () => {
    const userDetails = useSelector((state) => state.counter.userDetails);
    const [allPosts, setAllPosts] = useState([]);
    const videoRefs = useRef([]); // Ref array for videos
    const savedPost = useSelector((state) => state.counter.savedPosts);
    const navigate = useNavigate()
    const dispatch = useDispatch();

    // Timeouts for tracking how long the user watches each reel
    const watchTimeouts = useRef({});

    // Fetch posts from API and filter for videos (reels)
    const fetchPosts = async () => {
        try {
            const { data: posts } = await axios.get('/api/posts/getPosts');
            const reels = posts.filter(post => post?.mediaType === 'video');
            setAllPosts(reels); // Filtered reels only
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response.statusText === "Unauthorized") navigate('/login')

        }
    };

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

    // Track watch time and add to history if watched for at least 5 seconds
    const handleWatchStart = (postId, videoElement) => {
        watchTimeouts.current[postId] = setTimeout(() => {
            addToHistory(postId);
        }, 3000); // 5 seconds

        videoElement.play();
    };

    const handleWatchEnd = (postId, videoElement) => {
        clearTimeout(watchTimeouts.current[postId]);
        videoElement.pause();
    };

    const addToHistory = async (postId) => {
        const userId = userDetails.id;

        try {
            const response = await axios.post(`/api/users/reelHistory/${userId}/${postId}`);
            const watchHistory = response?.data?.user?.reelHistory
            dispatch(setWatchHistory([watchHistory]))
        } catch (error) {
            if (error.response.statusText === "Unauthorized") navigate('/login')
            console.error('Error adding to history:', error.message);
        }
    };

    // Create IntersectionObserver and assign to videos
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    const postId = video.dataset.postid;

                    if (entry.isIntersecting) {
                        handleWatchStart(postId, video);
                    } else {
                        handleWatchEnd(postId, video);
                    }
                });
            },
            { threshold: 0.75 } // Trigger observer when 75% of the video is visible
        );

        // Observe each video element
        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        // Cleanup observer on unmount
        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [allPosts]); // Only run effect when posts are updated

    useEffect(() => {
        fetchPosts();
        getSavePosts();
    }, []);

    return (
        <>
            <Sidebar />
            <div className="w-[81.2%] flex flex-col items-center p-4 ml-auto dark:bg-neutral-950 dark:text-white">
                <div className="w-full flex flex-wrap justify-center gap-4 mt-2">
                    {allPosts?.map((post, index) => (
                        <div
                            key={post._id}
                            className="relative w-full h-[90vh] flex justify-center items-center rounded-lg overflow-hidden"
                        >
                            <div className="h-full w-[300px] rounded-lg flex justify-center items-center overflow-hidden shadow-xl">
                                {/* Video Container */}
                                <div className="video h-full w-full relative rounded-lg overflow-hidden shadow-lg">
                                    <video
                                        ref={(el) => (videoRefs.current[index] = el)} // Assign ref to each video
                                        muted
                                        data-postid={post._id} // Store postId for reference in intersection observer
                                        src={`${post.mediaPath}`}
                                        loop
                                        className="object-cover w-full h-full rounded-lg"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                                        <div className="flex items-center mb-2">
                                            <Link to={`/profile/${post?.author?.username}/${post.caption}`} className='flex justify-center items-center'>
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage src={`http://localhost:5000/${post?.author?.profilePicture}`} alt={post?.username} className="w-full h-full rounded-full object-top object-cover" />
                                                    <AvatarFallback>{post?.username}</AvatarFallback>
                                                </Avatar>
                                                {/* </div> */}
                                                <span className="ml-2 text-white text-sm ">{post?.author?.username}</span>
                                            </Link>
                                            <Button variant="outline" className="ml-2 py-1 px-4 bg-transparent text-white text-xs">
                                                Follow
                                            </Button>
                                        </div>

                                        {/* Caption */}
                                        <p className="text-white text-sm mb-2">{post.caption}</p>

                                        {/* Song Info */}
                                        <div className="flex items-center text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-music"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                                            <span className='ml-2 text-sm'>James Quinn - Dreamer's Path</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="controls h-full w-[5%] flex flex-col justify-end items-center gap-5 py-1">
                                {/* Like Button */}
                                <div className="like flex flex-col justify-center items-center">
                                    <button onClick={(e) => handleLike(e, post._id)}>
                                        {/* <Heart className="w-6 h-6 hover:scale-110 transition-transform" /> */}
                                        {post?.likes?.includes(userDetails.id) ? <FaHeart className="w-6 h-6 text-red-500" /> : <Heart className="w-6 h-6 hover:scale-110 transition-transform" />}
                                    </button>
                                    <p className="text-sm">{post?.likes?.length}</p>
                                </div>

                                {/* Comment Button */}
                                <div className="comment flex flex-col justify-center items-center">
                                    <button >
                                        <MessageCircle
                                            style={{ transform: 'scaleX(-1)' }}
                                            className=" w-6 h-6 hover:scale-110 transition-transform"
                                        />
                                    </button>
                                    <p className="text-sm">{post?.comments?.length}</p>
                                </div>

                                {/* Share Button */}
                                <div className="share flex flex-col justify-center items-center">
                                    <Send className="w-6 h-6 hover:scale-110 transition-transform" />
                                    <p className="text-sm">0</p>
                                    {/* <p className="text-sm">{post?.likes?.length}</p> */}
                                </div>

                                {/* Save Button */}
                                <div className="save flex flex-col justify-center items-center">
                                    <button onClick={(e) => handleSavePosts(e, post._id)}>
                                        {/* <GoBookmark size={25} className="hover:scale-110 transition-transform" /> */}
                                        {Array.isArray(savedPost) && savedPost.includes(post._id) ? <GoBookmarkFill size={25} className="dark:text-white" /> : <GoBookmark size={25} className="hover:text-zinc-800 dark:hover:text-zinc-500 transition-colors darktext-white duration-100" />}

                                    </button>

                                </div>

                                {/* Options Button */}
                                <div className="options flex flex-col justify-center items-center">
                                    <BsThreeDots size={22} className="hover:scale-110 transition-transform" />
                                </div>
                                <div className="w-8 h-8 rounded-md border-[.2px] border-black bg-white flex items-center justify-center">
                                    <img
                                        src="/placeholder.svg?height=24&width=24"
                                        alt="User avatar"
                                        className="w-6 h-6 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ReelSection;
