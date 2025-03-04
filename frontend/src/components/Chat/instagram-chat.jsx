import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FaInstagram, FaRegEdit, FaRegHeart } from "react-icons/fa"
import MessagesMember from "./MessagesMember"
import { Link, useNavigate, useParams } from "react-router-dom"
import { GoHomeFill } from "react-icons/go"
import { IoSearchOutline } from "react-icons/io5"
import { MdOutlineExplore } from "react-icons/md"
import { BiSolidMoviePlay } from "react-icons/bi"
import { FiSend } from "react-icons/fi"
import { CiSquarePlus } from "react-icons/ci"
import { RxHamburgerMenu } from "react-icons/rx"
import { useDispatch, useSelector } from 'react-redux';
import { setFollowingUsers, setMessages, setSuggestedUser } from '@/features/userDetail/userDetailsSlice';
import ChatBox from "./ChatBox"
import { SearchDialogWithCheckboxesComponent } from "./search-dialog-with-checkboxes"
import { IoIosArrowDown } from "react-icons/io";
import Sidebar from "../Home/Sidebar"
import api from "@/api/api"

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
      const response = await api.get(`/conversations/followingUsers/${username}`);
      const gropuResponse = await api.get(`/conversations/groups/${userDetails.id}`);
      const followingUsers = [...response?.data, ...gropuResponse?.data]
      dispatch(setFollowingUsers(followingUsers))
      return response.data;
    } catch (error) {
      console.error('Error fetching following users:', error);
      if (error.response.statusText === "Unauthorized" || error.response?.status === 403) navigate('/login')

    }
  };


  // const getRealTimeMessages = () => {
  //   if (socketRef.current) {
  //     socketRef.current.on('newMessage', (newMessage) => {
  //       Array.isArray(messages) ?
  //         dispatch(setMessages([...messages, newMessage])) : "no";
  //     });

  //     socketRef.current.on('sendGroupMessage', (newMessage) => {
  //       Array.isArray(messages) ?
  //         dispatch(setMessages([...messages, newMessage])) : "no";
  //     });
  //   } else {
  //     console.error('Socket not initialized');
  //   }
  // }

  const getRealTimeMessages = () => {
    if (!socketRef.current) {
      console.error('Socket not initialized');
      return;
    }
    socketRef.current.on('newMessage', (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });
    socketRef.current.on('sendGroupMessage', (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });
  }
  

  useEffect(() => {
    getRealTimeMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage');
        socketRef.current.off('sendGroupMessage');
      }
    };
  }, [messages]);  // Depend on messages if necessary

  useEffect(() => {
    if (userDetails?.username) {
      dispatch(setSuggestedUser(null))
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
        // console.log('User details not available yet.');
        return;  // Exit the function early if userDetails is not set
      }

      if (suggestedUser && Object.keys(suggestedUser).length > 0) {
        const response = await api.get(
          suggestedUser && 'groupName' in suggestedUser
            ? `/conversations/group/messages/${suggestedUser?._id}`
            : `/conversations/all/messages/${suggestedUser?._id}?senderId=${senderId}`
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.messages));
        }
      }
    } catch (error) {
      console.log(error.message);
      if (error?.response?.statusText === "Unauthorized" || error.response?.status === 403) navigate('/login')

    }
  };


  return (
    (<div className="flex h-screen">
      <div className="flex-1 flex dark:bg-neutral-950 dark:text-white">
        {/* Sidebar */}

        <Sidebar compact />
        <div
          className={` ${suggestedUser ? "w-0" : 'w-full'} ml-20  md:w-80 border-r border-gray-200 dark:border-zinc-800 flex flex-col bg-white dark:bg-neutral-950 dark:text-white`}>
          <div
            className="p-4 border-gray-200 dark:border-zinc-800 dark:bg-neutral-950 dark:text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="font-semibold flex items-center gap-2 cursor-pointer dark:bg-neutral-950 dark:text-white">{userDetails.username} <IoIosArrowDown /></span>
            </div>
            <div className="flex space-x-2">
              <SearchDialogWithCheckboxesComponent socketRef={socketRef} />

            </div>
          </div>
          <div
            className="flex justify-between items-center px-4 py-2 border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-black dark:bg-neutral-950 dark:text-white">Messages</span>
            <span className="text-black dark:bg-neutral-950 dark:text-white text-sm">Requests</span>
          </div>
          <MessagesMember socketRef={socketRef} />
        </div>

        {/* Main Chat Area */}
        <ChatBox socketRef={socketRef} />
      </div>
    </div>)
  );
}