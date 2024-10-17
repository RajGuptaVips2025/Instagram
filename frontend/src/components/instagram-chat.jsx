import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FaInstagram, FaRegEdit, FaRegHeart } from "react-icons/fa"
import ChatBox from "./ChatBox"
import MessagesMember from "./MessagesMember"
import { Link, useNavigate } from "react-router-dom"
import { GoHomeFill } from "react-icons/go"
import { IoSearchOutline } from "react-icons/io5"
import { MdOutlineExplore } from "react-icons/md"
import { BiSolidMoviePlay } from "react-icons/bi"
import { FiSend } from "react-icons/fi"
import { CiSquarePlus } from "react-icons/ci"
import { RxHamburgerMenu } from "react-icons/rx"
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowingUsers, setMessages, setSuggestedUser } from '../features/userDetail/userDetailsSlice';

export function ChatComponent({ socketRef }) {
  const links = [
    { id: 1, icon: <GoHomeFill size={26} />, label: 'Home', link: '/' },
    { id: 2, icon: <IoSearchOutline size={26} />, label: 'Search', link: '#' },
    { id: 3, icon: <MdOutlineExplore size={26} />, label: 'Explore', link: '/explore/' },
    { id: 4, icon: <BiSolidMoviePlay size={26} />, label: 'Reels', link: '/reels/' },
    { id: 5, icon: <FiSend size={26} />, label: 'Messages', link: '/direct/inbox' },
    { id: 6, icon: <FaRegHeart size={26} />, label: 'Notification', link: '/' },
    { id: 7, icon: <CiSquarePlus size={26} />, label: 'Create', link: '/' },
    { id: 8, icon: <RxHamburgerMenu size={26} />, label: 'More', link: '/' },
    { id: 9, icon: <RxHamburgerMenu size={26} />, label: 'More', link: '/' },
  ];
  const messages = useSelector((state) => state.counter.messages);
  const userDetails = useSelector((state) => state.counter.userDetails);
  const suggestedUser = useSelector((state) => state.counter.suggestedUser);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const getFollowingUsers = async (username) => {
    try {
      const response = await axios.get(`/api/conversations/followingUsers/${username}`);
      const gropuResponse = await axios.get(`/api/conversations/groups/${userDetails.id}`);
      const followingUsers = [...response?.data, ...gropuResponse?.data]
      dispatch(setFollowingUsers(followingUsers))
      return response.data;
    } catch (error) {
      console.error('Error fetching following users:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')

    }
  };



  const getRealTimeMessages = () => {
    socketRef.current.on('newMessage', (newMessage) => {
      Array.isArray(messages) ?
        dispatch(setMessages([...messages, newMessage])) : "no"
    });
    socketRef.current.on('sendGroupMessage', (newMessage) => {
      Array.isArray(messages) ?
        dispatch(setMessages([...messages, newMessage])) : "no"
    });
    
  }



  useEffect(() => {

    getRealTimeMessages()

    return () => {
      socketRef.current.off('newMessage')
    }
  }, [messages, setMessages])



  useEffect(() => {
    if (userDetails?.username) {
      getFollowingUsers(userDetails.username);
    }
    return () => {
      dispatch(setSuggestedUser(null))
    }
  }, [userDetails, setMessages]);



  useEffect(() => {
    if (userDetails?.id) {
      gettAllMessages();
    }
  }, [userDetails, suggestedUser]);



  const gettAllMessages = async () => {
    try {
      const senderId = userDetails?.id;
      if (!senderId) {
        console.log('User details not available yet.');
        return;  // Exit the function early if userDetails is not set
      }

      if (suggestedUser && Object.keys(suggestedUser).length > 0) {
        const response = await axios.get(
          suggestedUser && 'groupName' in suggestedUser
            ? `/api/conversations/group/messages/${suggestedUser?._id}`
            : `/api/conversations/all/messages/${suggestedUser?._id}?senderId=${senderId}`
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.messages));
        }
      }
    } catch (error) {
      console.log(error.message);
      if (error?.response?.statusText === "Unauthorized") navigate('/login')

    }
  };


  return (
    (<div className="flex h-screen">
      <div className="flex-1 flex dark:bg-neutral-950 dark:text-white">
        {/* Sidebar */}
        <div className="h-screen w-[5.3%] flex flex-col gap-7 items-center border-r-[.1px] border-zinc-800">
          <div className="instaIcon my-8">
            <Link to="/">
              <FaInstagram size={26} />
            </Link>
          </div>
          {links.map((link) => (
            <Link to={link.link} key={link.id} className="flex items-center justify-between">
              {link.icon}
            </Link>
          ))}
        </div>
        <div
          className="w-80 border-r border-gray-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-neutral-950 dark:text-white">
          <div
            className="p-4 border-gray-200 dark:border-zinc-800 dark:bg-neutral-950 dark:text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-semibold dark:bg-neutral-950 dark:text-white">{userDetails.username}</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 text-black dark:bg-neutral-950 dark:text-white">
                <FaRegEdit size={20} />
              </Button>
            </div>
          </div>
          <div
            className="flex justify-between items-center px-4 py-2  border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-black dark:bg-neutral-950 dark:text-white">Messages</span>
            <span className="text-black dark:bg-neutral-950 dark:text-white text-sm">Requests</span>
          </div>
          <MessagesMember socketRef={socketRef} />
        </div>

        {/* Main Chat Area */}
        <ChatBox />
      </div>
    </div>)
  );
}