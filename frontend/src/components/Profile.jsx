import { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFollower, setFollowing } from '../features/userDetail/userDetailsSlice';
import Sidebar from './Sidebar';
import CreatePost from './CreatePost';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkIcon, Clapperboard, GridIcon, MessageCircle, SettingsIcon, UserIcon } from "lucide-react"
import { FaHeart } from 'react-icons/fa';
import { InstagramProfileSkeletonComponent } from './instagram-profile-skeleton';
import { IoChatbubbleSharp } from 'react-icons/io5';
import PostOpener from './PostOpener';


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username, reelId } = useParams();
  const [user, setUser] = useState(null);
  const [userID, setUserID] = useState(null)
  const [posts, setPosts] = useState([]);
  const [postsArr, setPostsArr] = useState([]);
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState("")
  const [followingUserss, setFollowingUserss] = useState();
  const userDetails = useSelector((state) => state.counter.userDetails);
  const watchHistory = useSelector((state) => state.counter.watchHistory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  console.log(selectedPost)

  // Function to handle post click
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };
 
  const fetchUserData = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data } = await axios.get(`/api/users/${username}`);
      setProfilePicture(data?.user?.profilePicture)
      setUserID(data?.user?._id)
      setUser(data.user);
      setPosts(data.posts);
      console.log(data.posts)
      setPostsArr(data.posts.reverse())
      setWatched(data?.posts?.filter(post => watchHistory[0].some(reelHistory=>reelHistory?.postId===post?._id)))
      if (reelId) {
        reelPart()
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error?.response?.statusText === "Unauthorized") navigate('/login')

    }
    finally {
      setIsLoading(false)
    }
  },[username, reelId, watchHistory, navigate])

  const handleLogout = async () => {
    try {
      const { status } = await axios.get('/api/auth/logout');
      if (status === 200) {
        console.log('Logged out successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleFollowing = async (e, followingID) => {
    e.preventDefault();
    const userId = userDetails.id;
    try {
      const { data: { following, followers } } = await axios.put(`/api/users/${userId}/following`, { followingID });
      dispatch(setFollowing(following));
      dispatch(setFollower(followers));
      setFollowingUserss(following);
    } catch (error) {
      console.error('Error following/unfollowing the user:', error);
      if (error.response.statusText === "Unauthorized") navigate('/login')

    }
  };
  const getFollowing = useCallback (async () => {
    const response = await axios.get(`/api/users/${userDetails.id}/following`)
    const following = response.data.following
    dispatch(setFollowing([...following]));
    setFollowingUserss(following)
  },[dispatch, userDetails.id])

  const reelPart = () => {
    const reelElement = document.getElementById(reelId);
    if (reelElement) {
      reelElement.scrollIntoView({ behavior: 'smooth', block: "center" });
    }
  }

  useEffect(() => {
    fetchUserData();
    getFollowing()
  }, [username]);
  useEffect(() => {
    if (reelId && postsArr.length) {
        reelPart();
    }
  }, [reelId, postsArr, reelPart]);

  if (!user) return <p>Loading...</p>;

  return (
  <div className='dark:bg-neutral-950 dark:text-white'>
    {/* <Sidebar /> */}
    {isLoading && <InstagramProfileSkeletonComponent />}
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="profile min-h-screen flex-grow px-4 sm:px-8 lg:px-[72px] py-[60px] ml-0 lg:ml-[14.5%] dark:bg-neutral-950 dark:text-white">
        <div className="inner-profile w-full h-full">
          <header className="flex flex-col md:flex-row items-center mb-8 gap-16 ml-10">
            <Avatar className="w-32 h-32 md:w-36 md:h-36 mb-4 md:mb-0 md:mr-8">
              <AvatarImage src={`http://localhost:5000/${profilePicture}`} alt={user.username} className="w-full h-full rounded-full object-top object-cover" />
              <AvatarFallback>{user.username}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <div className="flex items-center mb-4">
                <h1 className="text-2xl mr-4">{user.username}</h1>
                {userDetails?.id === userID ? (<>
                  <Link to={`/accounts/edit/${user?._id}`}>
                    <Button variant="secondary" className="mr-2 rounded-lg px-4" size="sm">Edit profile</Button>
                  </Link>
                  <Button variant="secondary" className="rounded-lg px-4" size="sm">View archive</Button>
                  <Button onClick={handleLogout} variant="ghost" size="icon" className="ml-2">
                    <SettingsIcon className="h-6 w-6" />
                  </Button>
                </>)
                  :
                  (<>
                    <Button onClick={(e) => handleFollowing(e, userID)} variant="secondary" className="mr-2 rounded-lg px-4" size="sm">{followingUserss?.includes(userID) ? "Following" : "follow"}</Button>

                    <Link to="/direct/inbox">
                      <Button variant="secondary" className="rounded-lg px-4" size="sm">Message</Button>
                    </Link>
                  </>)
                }
              </div>
              <div className="flex justify-center md:justify-start space-x-16 mb-4">
                <span><strong>{posts.length}</strong> posts</span>
                <span><strong>{user.followers?.length || 0}</strong> followers</span>
                <span><strong>{user.following?.length || 0}</strong> following</span>
              </div>
              <p className="font-medium">{user.fullName}</p>
              <p className='text-zinc-700 dark:text-white'>{user.bio}</p>
            </div>
          </header>

          {/* Highlights Section */}
          <section className="my-8 overflow-x-auto">
            <div className="flex space-x-4 justify-start items-center">
              {userDetails?.id === userID &&
                <>
                  <div className='rounded-full w-20 h-20 sm:w-24 sm:h-24 p-[.5px] ml-14 border border-zinc-800 flex items-center justify-center flex-shrink-0'>
                    <div className="add relative flex items-center justify-center">
                      <div className="vertical h-10 sm:h-12 w-[2px] bg-zinc-800 absolute"></div>
                      <div className="horizontal w-10 sm:w-12 h-[2px] bg-zinc-800 absolute"></div>
                    </div>
                  </div>
                </>
              }
            </div>
          </section>

          {/* Tabs Section */}
          <section className="createPosts mt-10 w-full h-auto">
            <Tabs defaultValue="posts" className="w-full h-full">
              <TabsList className="w-full justify-center">
                <TabsTrigger value="posts" className="flex-1"><GridIcon className="w-4 h-4 mr-2" />Posts</TabsTrigger>
                {userDetails.id === userID ?
                  <TabsTrigger value="saved" className="flex-1"><BookmarkIcon className="w-4 h-4 mr-2" />Saved</TabsTrigger>
                  :
                  <TabsTrigger value="saved" className="flex-1"><Clapperboard className="w-4 h-4 mr-2" />Reels  </TabsTrigger>
                }
                <TabsTrigger value="tagged" className="flex-1"><UserIcon className="w-4 h-4 mr-2" />Tagged</TabsTrigger>
                {userDetails.id === userID ? "" : <>
                  <TabsTrigger value="watched" className="flex-1"><UserIcon className="w-4 h-4 mr-2" />Watched</TabsTrigger>
                </>}
              </TabsList>

              <TabsContent value="posts" className='w-full h-full'>
                <div className="grid grid-cols-3 gap-1 mb-20 w-full h-full">
                  {postsArr.map((post) => (
                    <div key={post._id} className="relative w-full h-72 group cursor-pointer" onClick={() => handlePostClick(post)}>
                      <Card id={post?.caption} className="rounded-none border-none w-full h-full">
                        <CardContent className="p-0 w-full h-full">
                          {post?.mediaType === 'image' ? (
                            <img
                              src={`${post.mediaPath}`}
                              alt={post.caption}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <video
                              src={`${post.mediaPath}`}
                              className="w-full h-full aspect-square object-cover"
                            />
                          )}
                        </CardContent>
                      </Card>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {/* You can add content like likes and comments here */}
                        <div className="flex flex-col justify-center items-center gap-5">
                          <p className="text-white flex gap-5">
                            <div className="likes flex gap-2 justify-center items-center"><FaHeart className='w-6 h-6' /> {post?.likes?.length}</div>
                            <div className="comments flex gap-2 justify-center items-center"> <IoChatbubbleSharp className="w-6 h-6 -rotate-90" />  {post?.comments?.length}</div>
                          </p>
                          <p className='text-white'>caption : <span className='font-semibold'>{post?.caption}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
                {userDetails?.id === userID && <CreatePost />}
              </TabsContent>

              <TabsContent value="saved">
                <div className="text-center py-8 text-gray-500">No saved posts yet.</div>
                <div className="grid grid-cols-3 gap-1 mb-20 w-full h-full">
                  {postsArr.map((post) => (
                    <div key={post._id} className="relative w-full h-72 group">
                      <Card id={post?.caption} className="rounded-none border-none w-full h-full">
                        <CardContent className="p-0 w-full h-full">
                          {post?.mediaType === 'image' ? (
                            <img
                              src={`${post.mediaPath}`}
                              alt={post.caption}
                              className="w-full h-full object-cover object-top"
                            />
                          ) : (
                            <video
                              src={`${post.mediaPath}`}
                              className="w-full h-full aspect-square object-cover"
                            />
                          )}
                        </CardContent>
                      </Card>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {/* You can add content like likes and comments here */}
                        <div className="flex flex-col justify-center items-center gap-5">
                          <p className="text-white flex gap-5">
                            <div className="likes flex gap-2 justify-center items-center"><FaHeart className='w-6 h-6' /> {post?.likes?.length}</div>
                            <div className="comments flex gap-2 justify-center items-center"> <IoChatbubbleSharp className="w-6 h-6 -rotate-90" />  {post?.comments?.length}</div>
                          </p>
                          <p className='text-white'>caption : <span className='font-semibold'>{post?.caption}</span></p>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </TabsContent>

              <TabsContent value="tagged">
                <div className="text-center py-8 text-gray-500">No tagged posts yet.</div>
              </TabsContent>
              <TabsContent value="watched" className='w-full h-full'>
                <div className="grid grid-cols-3 gap-1 mb-20 w-full h-full">
                  {watched.map((watch) => (
                    <Card id={watch?.caption} key={watch._id} className="rounded-none border-none w-full h-72">
                      <CardContent className="p-0 w-full h-full">
                        {watch?.mediaType === 'image' ?
                          <>
                            <img src={`http://localhost:5000/${watch?.mediaPath}`} alt={watch?.caption} className="w-full h-full object-cover object-top" />
                          </>
                          :
                          <>
                            <video
                              src={`http://localhost:5000/${watch?.mediaPath}`}
                              className="w-full aspect-square object-cover"
                            />
                          </>
                        }
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>
    {/* PostOpener component for modal */}
    <PostOpener
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedPost={selectedPost}
        posts={postsArr}
      />
  </div>
  );
};

export default Profile;