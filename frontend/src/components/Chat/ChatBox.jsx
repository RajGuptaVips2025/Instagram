import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setMessages } from '../../features/userDetail/userDetailsSlice';
import axios from 'axios';
import { AiOutlineMessage } from 'react-icons/ai';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Camera, Heart, Info, Mic, Phone, Smile, Video, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "../ui/dialog";
import VideoCall from './VideoCall';
// import { useVideoCall } from '@/hooks/VideoCallContext';


function ChatBox() {
    // const { startCall, localVideoRef, remoteVideoRef } = useVideoCall();
    const suggestedUser = useSelector((state) => state.counter.suggestedUser);
    const userDetails = useSelector((state) => state.counter.userDetails);
    const messages = useSelector((state) => state.counter.messages);
    const [textMessage, setTextMessage] = useState('')
    const [file, setFile] = useState(null); // Store file
    const [filePreview, setFilePreview] = useState(null);
    const [isresOk, setIsResOk] = useState(true);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [selectedMedia, setSelectedMedia] = useState(null); // To track selected media
    const [isDialogOpen, setIsDialogOpen] = useState(false);  // To handle dialog state

    const handleMediaClick = (mediaUrl) => {
        setSelectedMedia(mediaUrl);
        setIsDialogOpen(true);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile)); // Generate preview URL
        }
    };

    const clearFile = () => {
        setFile(null);
        setFilePreview(null); // Clear file preview
    };


    const sendMessageHandle = async (e, reciverId) => {
        e.preventDefault();
        try {
            setIsResOk(false)

            const senderId = userDetails.id;
            // Check if textMessage and file are properly set
            if (!textMessage && !file) {
                return; // Avoid sending if no content
            }

            // Create form data to send media and message
            const formData = new FormData();
            formData.append('senderId', senderId); // Sender ID
            formData.append('textMessage', textMessage); // Text message
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
                console.log(response.data.newMessage)
                dispatch(setMessages([...messages, response.data.newMessage]));
                setTextMessage('');
                setFile(null);  // Reset file input after sending
                setFilePreview(null);
            }
        } catch (error) {
            console.log(error.message);
            if (error?.response && error?.response?.status === 401 || error.response?.status === 403) navigate('/login');
        }
        finally {
            setIsResOk(true)
        }
    };

    useEffect(() => {
        // Scroll to the bottom when the component mounts or when messages change
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    console.log(suggestedUser?._id)

    return (
        <>
            {/* <VideoCall userId={userDetails?.id} socketRef={socketRef} remoteUserId={suggestedUser?._id}  /> */}
            {suggestedUser ?
                (<div className="flex-grow flex flex-col bg-white dark:bg-neutral-950 dark:text-white">
                    <div
                        className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage className="object-cover object-top" src={suggestedUser?.profilePicture} />
                                <AvatarFallback>{suggestedUser?.username}</AvatarFallback>
                            </Avatar>
                            <div>
                                <Link to={`/profile/${suggestedUser?.username}`}>
                                    <p className="font-semibold text-sm dark:text-white">{suggestedUser?.username}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Active 1h ago</p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex">
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Phone className="h-6 w-6" />
                            </Button>
                            {/* <Button onClick={()=>startCall(suggestedUser?._id)} variant="ghost" size="sm" className="text-black dark:text-white"> */}
                            <Button onClick={() => navigate(`/call/${suggestedUser?._id}`)} variant="ghost" size="sm" className="text-black dark:text-white">
                                <Video className="h-7 w-7" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Info className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                    <ScrollArea className="flex-grow py-1 px-6">
                        <div className="flex justify-center">
                            <Avatar className="w-20 h-20">
                                <AvatarImage className="object-cover object-top w-full h-full" src={suggestedUser?.profilePicture} />
                                <AvatarFallback>{suggestedUser?.username}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <p className="text-center mt-2 font-semibold">{suggestedUser?.username}</p>
                            <p className="text-center mb-2">{suggestedUser?.fullName}</p>
                            <Link to={`/profile/${suggestedUser?.username}`}>
                                <Button className='text-sm'>View profile</Button>
                            </Link>
                        </div>
                        {messages && Array.isArray(messages) && messages?.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.senderId?._id === userDetails.id || message.senderId === userDetails.id
                                    ? "justify-end"
                                    : "justify-start"
                                    } my-0`}
                            >
                                <div className="messagebox flex gap-0 items-center">
                                    {!(message.senderId?._id === userDetails.id || message.senderId === userDetails.id) && (
                                        <div className="image">
                                            <Avatar className="w-5 h-5 bg-red-400">
                                                <AvatarImage
                                                    src={message?.senderId?.profilePicture}
                                                    className="w-full h-full rounded-full object-top object-cover"
                                                />
                                                <AvatarFallback className="text-xs">{message?.senderId?.username}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )}

                                    <div className="px-2 py-2 rounded-full break-words max-w-sm text-sm">
                                        {message.messageType === "image" && (
                                            <img
                                                src={message.mediaUrl}
                                                alt="Image message"
                                                className="w-56 h-96 rounded-xl object-cover cursor-pointer"
                                                onClick={() => handleMediaClick(message.mediaUrl)} // Open dialog on click
                                            />
                                        )}

                                        {message.messageType === "video" && (
                                            <video
                                                src={message.mediaUrl}
                                                className="w-56 h-80 rounded-xl bg-black object-cover cursor-pointer"
                                                onClick={() => handleMediaClick(message.mediaUrl)} // Open dialog on click
                                            />
                                        )}

                                        {message.messageType === "text" && (
                                            <p
                                                className={`px-3 py-2 rounded-full break-words max-w-sm text-sm ${message.senderId?._id === userDetails.id || message.senderId === userDetails.id
                                                    ? "bg-blue-400 text-white"
                                                    : "bg-neutral-100 dark:bg-zinc-800 dark:text-white"
                                                    }`}
                                            >
                                                {message.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                        {/* Dialog for displaying media */}
                        {selectedMedia && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger className="hidden" />
                                <DialogContent className="bg-transparent border-none shadow-none min-w-[80vw] max-w-[80vw] h-[90vh] flex justify-center items-center">
                                    <DialogClose onClick={() => setIsDialogOpen(false)} />
                                    {selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") ? (
                                        <video src={selectedMedia} autoPlay controls className="w-full h-full rounded-xl" />
                                    ) : (
                                        <img
                                            src={selectedMedia}
                                            alt="Selected media"
                                            className="w-full h-full rounded-xl object-contain"
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        )}
                    </ScrollArea >
                    <div className="px-4 pb-2">
                        <div className="message-form p-2 dark:bg-neutral-950 rounded-lg space-y-2">
                            {/* Media Preview Section */}
                            {filePreview && (
                                <div className="relative w-20 h-20">
                                    {file?.type?.startsWith('image/') ? (
                                        <img
                                            src={filePreview}
                                            alt="Selected"
                                            className="w-full h-full object-cover rounded-md"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <video
                                            src={filePreview}
                                            controls
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                    )}
                                    {/* Clear Icon to remove file */}
                                    <div
                                        onClick={clearFile}
                                        className='absolute right-1 top-1 p-1 bg-zinc-500/50 rounded-full '>
                                        <X
                                            className="dark:text-white rounded-full h-3 w-3 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Form Input Section */}
                            <form
                                onSubmit={(e) => sendMessageHandle(e, suggestedUser._id)}
                                className="flex items-center space-x-4 border border-zinc-800 bg-transparent rounded-full px-4 py-2"
                            >
                                <Smile className="h-6 w-6 text-black dark:text-white" />
                                <input
                                    value={textMessage}
                                    onChange={(e) => setTextMessage(e.target.value)}
                                    className="flex-grow bg-transparent border-none outline-none text-sm dark:text-white placeholder-gray-400"
                                    placeholder="Message..."
                                />
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
                                {isresOk ?

                                    <Button variant="outline" type="submit" className="text-sm font-semibold text-blue-400 hover:text-blue-400 hover:bg-white border-none dark:hover:bg-neutral-950 dark:hover:text-blue-400 p-0">
                                        Send
                                    </Button> :
                                    <Button disabled variant="outline" type="submit" className="text-sm font-semibold text-blue-400 hover:text-blue-400 hover:bg-white border-none dark:hover:bg-neutral-950 dark:hover:text-blue-400 p-0">
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Send
                                    </Button>
                                }
                            </form>
                        </div>
                    </div>
                </div >)
                : (
                    <div className="flex-grow flex flex-col justify-center items-center bg-white dark:bg-neutral-950 dark:text-white">
                        <div className="emptyField flex flex-col justify-center items-center">
                            <div>
                                <AiOutlineMessage size={100} />
                            </div>
                            <div className="flex flex-col justify-center items-center my-2">
                                <p className='text-xl'>Your messages</p>
                                <p className='text-zinc-500 text-sm'>Send a message to start a chat.</p>
                            </div>
                            <div className="flex justify-center items-center my-2">
                                <button className='bg-blue-500 text-sm font-semibold text-white px-3 py-2 rounded-md'> send message</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default ChatBox