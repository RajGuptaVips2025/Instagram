import React, { useEffect, useMemo, useState } from 'react';
import { FaRegHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { GoBookmark } from "react-icons/go";
import { GoBookmarkFill } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { setSavedPosts, setSelectedPost } from '../features/userDetail/userDetailsSlice';
import { FaHeart } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from './ui/button';
import { MoreHorizontal } from 'lucide-react';

function PostComment({ open, setOpen }) {
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const [commentsArr, setCommentsArr] = useState([]);
    const PostDetails = useSelector((state) => state.counter.selectedPost);
    const userDetails = useSelector((state) => state.counter.userDetails);
    const savedPosts = useSelector((state) => state.counter.savedPosts);
    const [liked, setLiked] = useState(PostDetails?.likes || []);
    const navigate = useNavigate()
    // Close the modal and reset selected post
    const handleClose = (e) => {
        e.preventDefault();
        dispatch(setSelectedPost(null));
        setOpen(false);
    };

    // Fetch comments from the server
    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/posts/${PostDetails?._id}/comment`);
            setCommentsArr(response.data.comments);
        } catch (error) {
            if (error.response.statusText === "Unauthorized") navigate('/login')
            console.error('Error fetching comments:', error);
        }
    };

    // Submit a new comment
    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            await axios.post(`/api/posts/${postId}/comment`, {
                userId: userDetails.id,
                text: comment,
            });
            fetchComments();
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            if (error.response.statusText === "Unauthorized") navigate('/login')
            setComment(''); // Clear the input in case of an error
        }
    };


    const handleRemoveComment = async (e, postId, commentId) => {
        e.preventDefault()
        try {
            const response = await axios.delete(`/api/posts/${postId}/comment/${commentId}`);

            if (response.status === 200) {
                setCommentsArr(response?.data?.post?.comments);
                // Dispatch an action to update the post in the Redux store if necessary
            }
        } catch (error) {
            console.error('Error removing comment:', error);
        }
    };


    // Handle like/unlike
    const handleLike = async (e, postId) => {
        e.preventDefault();
        const userId = userDetails.id;
        try {
            const response = await axios.put(`/api/posts/${postId}/like`, { userId });
            setLiked(prevLiked => {
                const userHasLiked = prevLiked.includes(userId);
                if (userHasLiked) {
                    return prevLiked.filter(id => id !== userId);
                } else {
                    return [...prevLiked, userId];
                }
            });
        } catch (error) {
            console.error('Error liking/unliking the post:', error);
            if (error.response.statusText === "Unauthorized") navigate('/login')

        }
    };


    const handleSavePost = async (e, postId) => {
        e.preventDefault();
        const userId = userDetails.id;
        try {
            const response = await axios.put(`/api/posts/${userId}/save`, {
                postId,
            });
            const savedPosts = response.data.savedPosts
            dispatch(setSavedPosts(savedPosts))
        } catch (error) {
            if (error.response.statusText === "Unauthorized") navigate('/login')
            console.error('Error liking/unliking the post:', error);
        }
    };

    // Update `liked` state when `PostDetails` changes
    useEffect(() => {
        if (PostDetails?.likes) {
            setLiked(PostDetails.likes);
        }
    }, [PostDetails]);

    useEffect(() => {

        if (PostDetails?._id) {
            fetchComments();
        }

    }, [PostDetails, liked]);



    return (
        <div className={`main z-10 text-white ${open ? "flex" : "hidden"} justify-center items-center fixed bg-black/75 w-screen h-screen`}>
            <button
                className="absolute top-4 right-16 text-2xl"
                onClick={handleClose} // Assuming you have a handleClose function to close the modal
            >
                <IoAddSharp size={40} style={{ transform: 'rotate(45deg)' }} />
            </button>
            <div className="w-[1198px] h-[580px] flex justify-center items-center">
                <div className="content flex justify-center h-full w-full">
                    {/* Left Image Section */}
                    <div className="right w-full md:w-auto h-full border-r-[.1px]  border-zinc-800">
                        <div className="image w-auto h-full overflow-hidden flex justify-center items-center">
                            {PostDetails?.mediaType === 'image' ? <img
                                className="max-w-[500px] w-auto h-auto object-cover object-top"
                                src={`http://localhost:5000/${PostDetails?.mediaPath}`}
                                alt="Post Image"
                                loading="lazy"
                            /> : <video
                                // ref={videoRef}
                                // onClick={handleVideoClick}
                                autoPlay
                                muted
                                controls
                                src={`http://localhost:5000/${PostDetails?.mediaPath}`}
                                loop
                                // className={`object-cover ${PostDetails?.imageWidth > 468 ? `w-[${PostDetails?.imageWidth}px]` : `w-[${PostDetails?.imageWidth}px]`} ${PostDetails?.imageHeight > 585 ? `h-[${PostDetails?.imageHeight}px]` : `h-[${PostDetails?.imageHeight}px]`} duration-300`}
                                className={`object-cover max-w-[800px] w-full h-full duration-300`}
                            />}

                        </div>
                    </div>

                    {/* Right Details Section */}
                    <div className="left w-[500px] h-full rounded-sm bg-black flex flex-col justify-between">
                        {/* Author Section */}
                        <div className="author border-b-[.1px] border-zinc-800 w-full h-[70px] flex items-center px-4">
                            <div className="flex items-center gap-2">
                                <div className="image w-8 h-8 rounded-full overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={`http://localhost:5000/${PostDetails?.author?.profilePicture}`}
                                        alt={`${userDetails?.username}'s profile`}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="authorDetail">
                                    <p className="text-sm font-semibold">{PostDetails?.author?.username}</p>
                                </div>
                            </div>
                            <div className="ml-auto">
                                <p className="text-sky-500 font-bold text-sm cursor-pointer">Follow</p>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className={`comments-section flex-1 overflow-y-auto p-4 ${commentsArr.length  === 0 ? 'flex justify-center items-center' : ''}`}>
                            {commentsArr.length > 0 ? (
                                commentsArr.map((comment) => (
                                    <div key={comment._id} className="mb-4">
                                        <Link to={`/profile/${comment?.user?.username}`}>
                                            <div className="flex justify-between items-center">
                                                <p className='flex justify-start items-center gap-3'>
                                                    <img className='rounded-full w-8 h-8 object-cover object-top aspect-auto' src={`http://localhost:5000/${comment?.profilePicture}`} alt="" />
                                                    <div className="flex gap-2 items-center">
                                                        <p className='flex justify-center items-center gap-1'> <strong className='hover:text-zinc-400 text-sm duration-150'>{comment?.user?.username} : </strong><p className='font-light text-sm'>{comment.text}</p></p>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="p-0">
                                                                    <MoreHorizontal className="w-5 h-5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-60">
                                                                <DropdownMenuItem className="text-red-600 justify-center font-bold focus:text-red-600 cursor-pointer">Report</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={(e) => handleRemoveComment(e,PostDetails?._id,comment?._id)} className="justify-center cursor-pointer text-red-600 font-semibold focus:text-red-600">Delete Message</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="justify-center cursor-pointer">Cancel</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </p>

                                                <div className="icon">
                                                    <FaRegHeart size={10} className="hover:text-zinc-500 transition-colors duration-100" />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">No comments yet. Be the first to comment!</p>
                            )}
                        </div>


                        {/* Actions and Like Section */}
                        <div className="actions border-t-[.1px] border-zinc-800 w-full px-4 py-3">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3">
                                    <button onClick={(e) => handleLike(e, PostDetails?._id)}>
                                        {liked.includes(userDetails.id) ? <FaHeart size={25} className="text-red-500" /> : <FaRegHeart size={25} className="hover:text-zinc-500 transition-colors duration-100" />}
                                    </button>
                                    <button>
                                        <IoChatbubbleOutline size={25} className="hover:text-zinc-500 transition-colors duration-100" style={{ transform: 'scaleX(-1)' }} aria-label="Comment" />
                                    </button>
                                    <button>
                                        <FiSend size={25} className="hover:text-zinc-500 transition-colors duration-100" aria-label="Share" />
                                    </button>
                                </div>
                                <div>
                                    <button onClick={(e) => handleSavePost(e, PostDetails?._id)}>
                                        {Array.isArray(savedPosts) && savedPosts?.includes(PostDetails?._id) ? <GoBookmarkFill size={25} className="text-white" aria-label="Save" /> : <GoBookmark size={25} className="hover:text-zinc-500 transition-colors duration-100" aria-label="Save" />}

                                    </button>
                                </div>
                            </div>
                            <div className="my-3 text-sm font-semibold">
                                <p>{liked.length || 0} likes</p>
                            </div>
                        </div>

                        {/* Bottom Comment Input Section */}
                        <div className="comment-input border-t-[.1px] border-zinc-800 w-full h-[50px] px-4">
                            <form onSubmit={(e) => handleCommentSubmit(e, PostDetails._id)} className="flex items-center pt-3">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    aria-label="Add a comment"
                                />
                                <button
                                    type="submit"
                                    className={`text-blue-500 font-bold text-sm ${!comment.trim() && 'text-zinc-900'}`}
                                    disabled={!comment.trim()}
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostComment;
