// settingsLinks.js
import { CgProfile } from "react-icons/cg";
import { FaRegBell } from "react-icons/fa";
import { MdOutlineLockPerson, MdStars, MdHideSource, MdLaptop, MdOutlineSupervisorAccount, MdOutlinePrivacyTip } from "react-icons/md";
import { ImBlocked, ImEyeBlocked } from "react-icons/im";
import { FiMessageCircle, FiShare2 } from "react-icons/fi";
import { CiAt, CiVolumeMute } from "react-icons/ci";
import { IoHeartDislike, IoLanguage, IoHelpBuoySharp, IoPersonOutline } from "react-icons/io5";
import { BsDownload } from "react-icons/bs";
import { HiOutlineChartBarSquare } from "react-icons/hi2";

export const settingsLinks = [
  { id: 1, icon: <CgProfile size={20} />, label: "Edit Profile", link: '/' },
  { id: 2, icon: <FaRegBell size={20} />, label: "Notifications", link: '/' },
  { id: 3, icon: <MdOutlineLockPerson size={20} />, label: "Account Privacy", link: '/' },
  { id: 4, icon: <MdStars size={20} />, label: "Close Friends", link: '/' },
  { id: 5, icon: <ImBlocked size={20} />, label: "Block", link: '/' },
  { id: 6, icon: <MdHideSource size={20} />, label: "Hide story and live", link: '/' },
  { id: 7, icon: <FiMessageCircle size={20} />, label: "Messages and story replies", link: '/' },
  { id: 8, icon: <CiAt size={20} />, label: "Tags and mentions", link: '/', },
  { id: 9, icon: <FiShare2 size={20} />, label: "Sharing and remixes", link: '/' },
  { id: 10, icon: <ImEyeBlocked size={20} />, label: "Restricted accounts", link: '/' },
  { id: 11, icon: <CiVolumeMute size={20} />, label: "Muted accounts", link: '/' },
  { id: 12, icon: <IoHeartDislike size={20} />, label: "Like and share counts", link: '/' },
  { id: 13, icon: <BsDownload size={20} />, label: "Archiving and downloading", link: '/' },
  { id: 14, icon: <IoLanguage size={20} />, label: "Language", link: '/' },
  { id: 15, icon: <MdLaptop size={20} />, label: "Website Permissions", link: '/' },
  { id: 16, icon: <MdOutlineSupervisorAccount size={20} />, label: "Supervision", link: '/' },
  { id: 17, icon: <HiOutlineChartBarSquare size={20} />, label: "Account type and tools", link: '/' },
  { id: 18, icon: <IoHelpBuoySharp size={20} />, label: "Help", link: '/' },
  { id: 19, icon: <MdOutlinePrivacyTip size={20} />, label: "Privacy Centre", link: '/' },
  { id: 20, icon: <IoPersonOutline size={20} />, label: "Account Status", link: '/' },
];
