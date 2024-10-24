import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { FiSend } from "react-icons/fi";
import { FaRegHeart } from "react-icons/fa";
import InstaLogo from '../assets/InstaLogo.png';

function Navbar() {
    const userDetails = useSelector((state) => state.counter.userDetails)
    const links = [
        { id: 2, icon: <FaRegHeart size={20} />, link: '/' },
        { id: 1, icon: <FiSend size={20} /> ,link: '/' },
    ];
    return (
        <>
            <aside className="z-50 fixed hidden top-0 w-full h-16 bg-black border-r border-zinc-800">
                <div className="flex w-screen items-center justify-between">
                    <div className=" ml-5 flex items-center mt-4">
                        <img className="w-20" src={InstaLogo} alt="Instagram Logo" />
                    </div>
                    <nav className="flex gap-3 mt-2 items-center mr-8 ">
                        {links.map((link) => (
                            <Link key={link.id} to={link.link} className=" ">
                                <div className="flex items-center rounded-md cursor-pointer ">
                                    <span className="text-white">{link.icon}</span> 
                                </div>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default Navbar   