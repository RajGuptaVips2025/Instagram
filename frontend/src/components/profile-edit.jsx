"'use client'"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BellIcon, LockIcon, UserIcon } from "lucide-react"
import { TiDeviceLaptop } from "react-icons/ti"
import { settingsLinks } from "./settingsLinks"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import Sidebar from "./Sidebar"
import { addUser } from "@/features/userDetail/userDetailsSlice"
import { useDispatch } from "react-redux"

export function ProfileEdit() {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('bio', bio); // Include bio in the form data
    if (profileImage) {
      formData.append('media', profileImage);
    }

    try {
      const response=await axios.post(`/api/users/edit/${id}`, formData, { withCredentials: true });
      console.log(response)
      const profilePic = response?.data?.user?.profilePicture
      dispatch(addUser({
        fullName: response?.data?.user?.fullName,
        username: response?.data?.user?.username,
        email: response?.data?.user?.email,
        id: response?.data?.user?._id,
        profilePic: profilePic
      }));
      navigate(`/profile/${username}`);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      if (error.response.statusText === "Unauthorized") navigate('/login')

    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };
  return (
    (
      <>
        <Sidebar />
        <div className="flex w-[81.8%] ml-auto">
          <div className="container mx-auto dark:bg-neutral-950 dark:text-white h-screen overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-1">
              <aside className="w-full md:w-80 bg-white dark:bg-neutral-950 dark:text-white p-6 h-screen overflow-y-auto">
                <h2 className="text-2xl dark:text-white font-bold mb-4">Settings</h2>
                <div className="space-y-2 rounded-lg shadow-xl p-3 dark:bg-zinc-700 dark:hover:bg-zinc-600">
                  <div className="font-semibold dark:text-white">Meta</div>
                  <div className="font-semibold dark:text-white">Account Center</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                    Manage your connected experiences and account settings across Meta technologies.
                  </div>
                  <Button variant="ghost" className="w-full px-1 justify-start text-gray-700 dark:text-gray-300 text-xs">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Personal details
                  </Button>
                  <Button variant="ghost" className="w-full px-1 justify-start text-gray-700 dark:text-gray-300 text-xs">
                    <LockIcon className="mr-2 h-4 w-4" />
                    Password and security
                  </Button>
                  <Button variant="ghost" className="w-full px-1 justify-start text-gray-700 dark:text-gray-300 text-xs">
                    <TiDeviceLaptop className="mr-2 h-4 w-4" /> Ad preferences
                  </Button>
                  <Button variant="link" className="text-xs text-blue-600 dark:text-blue-400 mt-2">See more in Accounts Center</Button>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="font-semibold dark:text-white">How you use Instagram</div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Edit profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300">
                    <BellIcon className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="font-semibold dark:text-white">Who can see your content</div>
                  {settingsLinks.map((link) => (
                    <Button key={link.id} variant="ghost" className="w-full justify-start text-gray-700 dark:text-gray-300">
                      <span className="mr-2">{link.icon}</span>
                      {link.label}
                    </Button>
                  ))}
                </div>
              </aside>
              <main className="flex-1 bg-white dark:bg-neutral-950 dark:text-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 dark:text-white">Edit profile</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={previewImage} className="object-cover object-top" />
                      <AvatarFallback>HK</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold dark:text-white">{username}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{name}</div>
                    </div>
                    <Button className="ml-auto bg-blue-500 hover:bg-blue-600 text-white">Change photo</Button>
                  </div>
                  <div>
                    <Label htmlFor="username" className="text-gray-700 dark:text-white">Username</Label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="username" className="resize-none mt-1 dark:bg-transparent dark:text-white dark:border-white" />
                  </div>
                  <div>
                    <Label htmlFor="name" className="text-gray-700 dark:text-white">Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="name" className="mt-1 dark:bg-transparent dark:text-white dark:border-white" />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-gray-700 dark:text-white">Bio</Label>
                    <Textarea id="bio" placeholder="Bio" className="resize-none mt-1 dark:bg-transparent dark:text-white dark:border-white" />
                    <div className="text-sm text-gray-600 text-right dark:text-white">0 / 150</div>
                  </div>
                  <div>
                    <Label htmlFor="profileImage" className="text-gray-700 dark:text-white">Profile Image</Label>
                    <Input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      onChange={handleFileChange}
                      className="mt-1 dark:bg-transparent dark:text-white dark:border-white"
                    />
                  </div>
                  <Button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white">Submit</Button>
                </form>
              </main>
            </div>
          </div>
        </div>
      </>)
  );
}