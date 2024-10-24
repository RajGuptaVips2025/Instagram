import React, { useState } from 'react';
import { BiSolidMoviePlay } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { CiSquarePlus } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Compass, Heart, Home, Menu, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import Notification from './Notification'; // Import your Notification component

function Sidebar() {
    const userDetails = useSelector((state) => state.counter.userDetails);
    let RTMNotification = useSelector((state) => state.counter.rtmNotification);
    RTMNotification = Object.values(RTMNotification);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // Control notification panel
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchClick = () => setIsSearchOpen(!isSearchOpen);
    const handleNotificationOpen = () => setIsNotificationOpen(true);  // Open notification panel
    const handleNotificationClose = () => setIsNotificationOpen(false); // Close notification panel

    const links = [
        { id: 1, icon: <Home className="mr-2 h-6 w-6" />, label: "Home", link: '/' },
        { id: 2, icon: <Search className="mr-2 h-6 w-6" />, label: "Search", link: '#', onClick: handleSearchClick },
        { id: 3, icon: <Compass className="mr-2 h-6 w-6" />, label: "Explore", link: '/explore/' },
        { id: 4, icon: <BiSolidMoviePlay className='mr-2 h-6 w-6' />, label: "Reels", link: '/reels/' },
        { id: 5, icon: <FiSend className="mr-2 h-6 w-6" />, label: "Messages", link: '/direct/inbox' },
        { id: 6, icon: <Heart className="mr-2 h-6 w-6" />, label: "Notification", link: '#', onClick: handleNotificationOpen }, // Open Notification Panel
        { id: 7, icon: <CiSquarePlus className='mr-2 h-6 w-6' />, label: "Create" },
        {
            id: 8,
            icon: (
                <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={userDetails.profilePic} alt={userDetails.username} />
                    <AvatarFallback>{userDetails.username}</AvatarFallback>
                </Avatar>
            ),
            label: "Profile",
            link: `/profile/${userDetails.username}`,
        }
    ];

    return (
        <>
            <aside className="fixed left-0 top-0 bottom-0 w-64 border-r p-4 bg-white z-10">
                <h1 className="text-xl font-semibold mb-8 mt-8 ml-5">Instagram</h1>
                <nav className="space-y-5 flex-grow">
                    {links.map((link) => (
                        <div key={link.id}>
                            {link.label === 'Notification' ? (
                                <>
                                    <Button variant="ghost" className="w-full justify-start relative" onClick={link.onClick}>
                                        <Heart className="mr-2 h-6 w-6" />
                                        {link.label}

                                        {/* Display notification count (circle) */}
                                        {RTMNotification && RTMNotification.length > 0 && (
                                            <div className="absolute top-1 left-8 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                                                {RTMNotification.length}
                                            </div>
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link to={link.link}>
                                        {link.icon}
                                        {link.label}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ))}
                </nav>
                <Button variant="ghost" className="w-full justify-start mt-auto" asChild>
                    <Link to='/'>
                        <Menu className="mr-2 h-6 w-6" />
                        More
                    </Link>
                </Button>
            </aside>

            {/* Notification Panel - Sliding in */}
            {isNotificationOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={handleNotificationClose}>
                    <NotificationPanel onClose={handleNotificationClose} notifications={RTMNotification} />
                </div>
            )}
        </>
    );
}

export default Sidebar;

// Sliding Notification Panel Component
function NotificationPanel({ onClose, notifications }) {
    return (
        <div
            className="fixed left-0 top-0 h-full w-[420px] bg-white shadow-lg p-4 transition-transform transform translate-x-0"
            style={{ transition: 'transform 0.3s ease-in-out' }}
        >
            <Button variant="ghost" onClick={onClose} className="mb-4">
                Close
            </Button>

            <ScrollArea className="h-[calc(100%-50px)]">
                {notifications && notifications.length > 0 ? (
                    notifications.map((user) => (
                        <div key={user.id} className="flex items-center my-4">
                            <Avatar className="w-12 h-12">
                                <AvatarImage src={user.userPic} alt={user.username} />
                                <AvatarFallback>{user.username}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <Link to={`/profile/${user.username}`} className="font-medium">{user.username}</Link>
                                <p className="text-sm text-gray-500">Liked your post</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No notifications</p>
                )}
            </ScrollArea>
        </div>
    );
}