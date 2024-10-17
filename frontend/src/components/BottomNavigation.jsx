
import React from 'react'; 
import { GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5"; 
import { BiSolidMoviePlay } from "react-icons/bi"; 
import { CiSquarePlus } from "react-icons/ci"; 
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import myPic from '../assets/myPic.jpeg'


function BottomNavigation() {
    const userDetails = useSelector((state) => state.counter.userDetails);

    const links = [
        { id: 1, icon: <GoHomeFill size={25} />, link: '/' },
        { id: 2, icon: <IoSearchOutline size={25} />, link: '/' },
        { id: 3, icon: <CiSquarePlus size={25} />, link: '/' },
        { id: 4, icon: <BiSolidMoviePlay size={25} />, link: '/' },
        {
            id: 5,
            icon: (
                <img
                    className="w-[24px] h-[24px] rounded-full object-cover"
                    src={myPic}
                    alt={userDetails.username}
                />
            ),
           
            link: `/profile/${userDetails.username}`,
        },
    ];

    return (
        <aside className="fixed  hidden bottom-0 w-full h-10 bg-black border-r border-zinc-800">
            <div className="flex w-full items-center">
                <nav className="flex gap-1 w-full items-center">
                    {links.map((link) => (
                        <Link key={link.id} to={link.link} className="w-[90%] ">
                            <div className="flex items-center gap-4 p-3 rounded-md cursor-pointer ">
                                <span className="text-white">{link.icon}</span> 
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}

export default BottomNavigation;
