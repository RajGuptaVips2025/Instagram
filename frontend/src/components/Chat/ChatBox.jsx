import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setMessages } from '../../features/userDetail/userDetailsSlice';
import axios from 'axios';
import { AiOutlineMessage } from 'react-icons/ai';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Camera, Heart, Info, Mic, Phone, Smile, Video } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { io } from 'socket.io-client';

function ChatBox() {

    const suggestedUser = useSelector((state) => state.counter.suggestedUser);
    const userDetails = useSelector((state) => state.counter.userDetails);
    const messages = useSelector((state) => state.counter.messages);
    const [textMessage, setTextMessage] = useState('');
    const [file, setFile] = useState(null); // Store file
    const [filePreview, setFilePreview] = useState(null); // Store preview URL
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();
    const socketRef = useRef();
    const dispatch = useDispatch();
    console.log(suggestedUser);

    const sendMessageHandle = async (e, reciverId) => {
        e.preventDefault();
        try {

            const senderId = userDetails.id;
            if (!textMessage && !file) return;

            // Create form data to send media
            const formData = new FormData();
            formData.append('senderId', senderId);
            formData.append('textMessage', textMessage);
            if (file) {
                formData.append('media', file);  // Include file if exists
            }
            formData.append('messageType', file ? (file.type.includes('video') ? 'video' : 'image') : 'text');

            const response = suggestedUser && 'groupName' in suggestedUser ?
                await axios.post(`/api/conversations/group/send/message/${suggestedUser?._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }) :
                await axios.post(`/api/conversations/send/message/${reciverId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

            if (response.data.success) {
                dispatch(setMessages([...messages, response.data.newMessage]));
                setTextMessage('');
                setFile(null);  // Reset file input after sending
                setFilePreview(null);  // Clear preview after sending\
            }
        } catch (error) {
            console.log(error.message);
            if (error?.response?.statusText === "Unauthorized") navigate('/login');
        }
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:5000', {
            query: { userId: userDetails.id }
        });

        // Listen for typing event
        socketRef.current.on('typing', ({ senderId }) => {
            if (senderId === suggestedUser._id) {
                setIsTyping(true);
            }
        });

        // Listen for stopTyping event
        socketRef.current.on('stopTyping', ({ senderId }) => {
            if (senderId === suggestedUser._id) {
                setIsTyping(false);
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [suggestedUser, userDetails]);

    // Handle file selection and create preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        // Create a preview URL for the file
        const previewUrl = URL.createObjectURL(selectedFile);
        setFilePreview(previewUrl);
    };

    const handleTyping = (e) => {
        setTextMessage(e.target.value);
        socketRef.current.emit('typing', { receiverId: suggestedUser._id });

        setTimeout(() => {
            socketRef.current.emit('stopTyping', { receiverId: suggestedUser._id });
        }, 3000);
    };

    return (
        <>
            {suggestedUser ? (
                <div className="flex-grow flex flex-col bg-white dark:bg-neutral-950 dark:text-white">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage className="object-cover object-top" src={`http://localhost:5000/${suggestedUser?.profilePicture}`} />
                                <AvatarFallback>{suggestedUser?.username}</AvatarFallback>
                            </Avatar>
                            <div>
                                <Link to={`/profile/${suggestedUser?.username}`}>
                                    <p className="font-semibold text-sm dark:text-white">{suggestedUser?.username}</p>
                                    {/* <p className="text-xs text-gray-500 dark:text-gray-400">Active 1h ago</p> */}
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {isTyping ? 'typing...' : 'Active 1h ago'}
                                    </p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex">
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Phone className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Video className="h-7 w-7" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Info className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    <ScrollArea className="flex-grow py-4 px-6">
                        <div className="flex justify-center">
                            <Avatar className="w-20 h-20">
                                <AvatarImage className="object-cover object-top w-full h-full" src={`http://localhost:5000/${suggestedUser?.profilePicture}`} />
                                <AvatarFallback>{suggestedUser?.username}</AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Messages */}
                        {/* Messages */}
                        {messages && Array.isArray(messages) && messages.map((message, index) => (
                            <div key={index} className={`flex ${message.senderId?._id === userDetails.id || message.senderId === userDetails.id
                                ? "justify-end"
                                : "justify-start"} my-1`}>
                                <div className={`
                                    px-3 py-2 rounded-full break-words max-w-sm text-sm
                                    ${message.senderId?._id === userDetails.id || message.senderId === userDetails.id
                                        ? message.messageType === 'text'
                                            ? "bg-blue-400 text-white"
                                            : "bg-transparent" // No background for images and videos
                                        : "bg-neutral-100 dark:bg-zinc-800 dark:text-white"
                                    }`}>
                                    {message.messageType === 'image' && (
                                        <img
                                            src={message.mediaUrl}
                                            alt="Image message"
                                            className="max-w-full h-[200px] w-[200px] object-cover rounded-lg"
                                        />
                                    )}

                                    {message.messageType === 'video' && (
                                        <video
                                            controls
                                            src={message.mediaUrl}
                                            className="max-w-full h-[200px] w-[200px] object-cover rounded-lg"
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    )}

                                    {message.messageType === 'text' && (
                                        <p className="break-words">{message.message}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </ScrollArea>

                    {/* Input Box */}
                    <div className="p-4">
                        <form onSubmit={(e) => sendMessageHandle(e, suggestedUser._id)} className="flex items-center space-x-4 border-[.2px] border-zinc-800 bg-transparent rounded-full px-4 py-2">
                            <Smile className="h-6 w-6 text-black dark:text-white" />
                            {/* <input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                className="flex-grow bg-transparent border-none outline-none text-sm dark:text-white"
                                placeholder="Message..."
                            /> */}
                            <input
                                value={textMessage}
                                onChange={handleTyping}
                                className="flex-grow bg-transparent border-none outline-none"
                                placeholder="Message..."
                            />

                            {/* Display file preview */}
                            {filePreview && (
                                <div className="flex items-center">
                                    {file?.type.includes('image') && (
                                        <img src={filePreview} alt="preview" className="w-10 h-10 object-cover rounded-full mr-2" />
                                    )}
                                    {file?.type.includes('video') && (
                                        <video src={filePreview} className="w-10 h-10 object-cover rounded-full mr-2" />
                                    )}
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="fileInput"
                            />
                            <label htmlFor="fileInput">
                                <Camera className="h-6 w-6 text-black dark:text-white cursor-pointer" />
                            </label>
                            <button type="submit" className="text-sm font-semibold text-blue-400">Send</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex flex-col justify-center items-center bg-white dark:bg-neutral-950 dark:text-white">
                    <div className="emptyField flex flex-col justify-center items-center">
                        <div>
                            <AiOutlineMessage size={100} />
                        </div>
                        <div className="flex flex-col justify-center items-center my-2">
                            <p className="text-xl">Your messages</p>
                            <p className="text-zinc-500 text-sm">Send a message to start a chat.</p>
                        </div>
                        <div className="flex justify-center items-center my-2">
                            <button className="bg-blue-500 text-sm font-semibold text-white px-3 py-2 rounded-md">Send message</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ChatBox;