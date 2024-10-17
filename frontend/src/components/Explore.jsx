import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import { IoChatbubbleSharp } from "react-icons/io5";
import PostComment from './PostComment';
import { useDispatch } from 'react-redux';
import { setSelectedPost } from '../features/userDetail/userDetailsSlice';
import { useNavigate } from 'react-router-dom';

const ExploreGrid = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const fetchPosts = async () => {
        try {
            const { data: posts } = await axios.get('/api/posts/getPosts');
            setAllPosts(posts.reverse());
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (error.response.statusText === "Unauthorized") navigate('/login')
        }
    };

    const showComments = (e, post) => {
        e.preventDefault();

        setOpen(true)
        dispatch(setSelectedPost(post));
    };


    useEffect(() => {
        fetchPosts();
    }, []);

    // Function to render media (image or video) with hover effects
    const renderMedia = (post) => {
        return (
            <>
                {post?.mediaType === 'image' ? (
                    <img
                        src={`http://localhost:5000/${post?.mediaPath}`}
                        alt={post?.caption}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <video
                        autoPlay
                        muted
                        src={`http://localhost:5000/${post?.mediaPath}`}
                        loop
                        className="object-cover w-full h-full duration-300"
                    />
                )}
                {/* Hover Effect */}
                <div className="bg-black/20 text-white absolute w-full h-full top-0 hidden group-hover:flex justify-center items-center gap-5">
                    <div className="likes flex justify-center items-center gap-1">
                        <FaHeart size={18} className="" />
                        <p>{post?.likes?.length}</p>
                    </div>
                    <div className="comments flex justify-center items-center gap-1">
                        <IoChatbubbleSharp className="transition-colors text-white duration-100" size={25} style={{ transform: 'scaleX(-1)' }} />
                        <p>{post?.comments?.length}</p>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <PostComment open={open} setOpen={setOpen} func={fetchPosts} />
            <div className="w-[81.8%] dark:bg-neutral-950 min-h-screen grid grid-cols-3 gap-1 px-20 py-12 ml-auto">
                {allPosts?.map((post, index) => {
                    if (index === 2) {
                        // The third item will span both rows
                        return (
                            <div onClick={(e) => showComments(e, post)}
                                key={post?._id}
                                className="relative h-full col-span-1 row-span-2 group"
                            >
                                {renderMedia(post)}
                                <div className="absolute top-5 right-5 text-white">
                                    <BiSolidMoviePlay size={25} />
                                </div>
                                <p className="absolute bottom-2 left-2 text-white">{post?.caption}</p>
                            </div>
                        );
                    }

                    // Render all other posts
                    return (
                        <div onClick={(e) => showComments(e, post)} key={post?._id} className="w-full relative h-80 bg-gray-800 col-span-1 group">
                            {renderMedia(post)}
                            <div className="absolute top-5 right-5 text-white">
                                <BiSolidMoviePlay size={25} />
                            </div>
                            <p className="absolute bottom-2 left-2 text-white">{post?.caption}</p>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const Explore = () => {
    return (
        <>
            <Sidebar />
            <ExploreGrid />
        </>
    );
};

export default Explore;
