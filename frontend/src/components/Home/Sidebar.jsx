import React, { useState } from 'react';
import { BiSolidMoviePlay } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { CiSquarePlus } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button } from '../ui/button';
import { Compass, Heart, Home, Menu, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';  // shadcn popover import
import { ScrollArea } from '../ui/scroll-area';

function Sidebar() {
    const userDetails = useSelector((state) => state.counter.userDetails);
    let RTMNotification = useSelector((state) => state.counter.rtmNotification);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    RTMNotification = Object.values(RTMNotification)
    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearchChange = async (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        if (searchQuery) {
            try {
                const response = await axios.get(`/api/search/users?query=${searchQuery}`);
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setResults([]);
        }
    };

    const links = [
        { id: 1, icon: <Home className="mr-2 h-6 w-6" />, label: "Home", link: '/' },
        { id: 2, icon: <Search className="mr-2 h-6 w-6" />, label: "Search", link: '#', onClick: handleSearchClick },
        { id: 3, icon: <Compass className="mr-2 h-6 w-6" />, label: "Explore", link: '/explore/' },
        { id: 4, icon: <BiSolidMoviePlay className='mr-2 h-6 w-6' />, label: "Reels", link: '/reels/' },
        { id: 5, icon: <FiSend className="mr-2 h-6 w-6" />, label: "Messages", link: '/direct/inbox' },
        { id: 6, icon: <Heart className="mr-2 h-6 w-6" />, label: "Notification", link: '/' },
        { id: 7, icon: <CiSquarePlus className='mr-2 h-6 w-6' />, label: "Create", link: '/' },
        {
            id: 8,
            icon: (
                <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={userDetails.profilePic} alt={`${userDetails.username}`} className="object-cover object-top" />
                    <AvatarFallback>{userDetails.username}</AvatarFallback>
                </Avatar>
            ),
            label: "Profile",
            link: `/profile/${userDetails.username}`,
        }
    ];

    return (
        <aside
            className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-300 dark:border-zinc-800 p-4 lg:flex flex-col bg-white z-10 dark:bg-neutral-950 dark:text-white">
            <h1 className="text-xl font-semibold mb-8 mt-8 ml-5">Instagram</h1>
            <nav className="space-y-5 flex-grow">
                {links.map((link) => (
                    <div key={link.id}>
                        {link.label === 'Notification' ? (
                            <>
                                {/* <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-start">
                                            <Heart className="mr-2 h-6 w-6" />
                                            {link.label}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto ml-14 p-0">
                                        <ScrollArea className="h-48 p-4">
                                            {RTMNotification && Array.isArray(RTMNotification) && RTMNotification?.map((user) => (
                                                <div className="flex flex-col gap-5 justify-center " key={user.id}>
                                                    <div className="flex items-center space-x-4 p-0 my-2">
                                                        <Link to={`/profile/${user.username}`} className='flex items-center gap-4'>
                                                            <Avatar className="w-12 h-12">
                                                                <AvatarImage src={user.userPic} alt={user.username} />
                                                                <AvatarFallback>{user.username}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium">{user.username}</p>
                                                                <p className="text-sm text-gray-500">Liked your post</p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover> */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-start relative">
                                            <Heart className="mr-2 h-6 w-6" />
                                            {link.label}

                                            {/* Notification badge (circle) */}
                                            {RTMNotification && RTMNotification.length > 0 && (
                                                <div className="absolute top-1 left-8 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                                                    {RTMNotification.length}
                                                </div>
                                            )}
                                        </Button>
                                    </PopoverTrigger>

                                    <PopoverContent className={`${RTMNotification.length > 0 ? "w-auto" : "w-0"} ml-14 p-0`}>
                                        <ScrollArea className={`${RTMNotification.length > 0 ? "h-48 p-4" : "h-0"}`}>
                                            {RTMNotification && Array.isArray(RTMNotification) && RTMNotification?.map((user) => (
                                                <div className="flex flex-col gap-5 justify-center " key={user.id}>
                                                    <div className="flex items-center space-x-4 p-0 my-2">
                                                        <Link to={`/profile/${user.username}`} className='flex items-center gap-4'>
                                                            <Avatar className="w-12 h-12">
                                                                <AvatarImage src={user.userPic} alt={user.username} className="object-cover object-top" />
                                                                <AvatarFallback>{user.username}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium">{user.username}</p>
                                                                <p className="text-sm text-gray-500">Liked your post</p>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    </PopoverContent>
                                </Popover>

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
    );
}

export default Sidebar;

