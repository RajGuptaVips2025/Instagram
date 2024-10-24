import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import CommentForm from "./CommentForm";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, MoreHorizontal, Send, Volume2, VolumeX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const Post = ({ post, userDetails, savedPost, followingUserss, handleLike, handleSavePosts, showComments, handleFollowing, handleCommentSubmit }) => {
  // console.log(post)

  const videoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target === videoRef.current) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    });
  };


  const handleVideoClick = () => {
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };


  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.75, // Play when 75% of the video is visible
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef]);
  return (
    <div className="space-y-8 mb-4">
      <Card key={post._id} className="w-11/12 border-t-0 border-x-0 rounded-none border-b-[.1px] border-zinc-300 shadow-none">
        <CardHeader className="flex flex-row items-center space-x-4 px-0 py-4">
          <Link to={`/profile/${post?.author?.username}`}>
            <Avatar>
              <AvatarImage src={post?.author?.profilePicture} className="object-cover object-top" />
              <AvatarFallback>{post?.author?.username}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-grow gap-4">
            <div className="flex flex-col">
              <Link to={`/profile/${post?.author?.username}`}>
                <p className="text-sm font-semibold">{post?.author?.username}</p>
              </Link>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {post?.author?.username} song
              </p>
            </div>
            <button onClick={(e) => handleFollowing(e, post.author._id)}>
              <h2 className="text-sm font-semibold text-sky-400 hover:text-sky-700">
                {userDetails.id === post.author._id ? "" : !followingUserss?.includes(post.author._id) && "Follow"}
              </h2>
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuItem className="text-red-600 justify-center font-bold focus:text-red-600 cursor-pointer">Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              {followingUserss?.includes(post.author._id) && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => handleFollowing(e, post.author._id)}
                    className="text-red-600 justify-center font-bold focus:text-red-600 cursor-pointer"
                  >
                    Unfollow
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="justify-center cursor-pointer">Add to favorites</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`/profile/${post?.author?.username}/${post.caption}`}>
                <DropdownMenuItem className="justify-center cursor-pointer">Go to post</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Share to...</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Copy link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Embed</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`/profile/${post?.author?.username}`}>
                <DropdownMenuItem className="justify-center cursor-pointer">About this account</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {post?.media?.length > 1 ?
          (
            <Carousel className="w-full">
              <CarouselContent>
                {post.media.map((mediaItem, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="rounded-sm">
                        <CardContent onDoubleClick={(e) => handleLike(e, post._id)} className="p-0 relative border-[.1px] h-[80vh] border-zinc-300 dark:border-zinc-800 rounded-sm overflow-hidden flex justify-center items-center">
                          {mediaItem?.mediaType === 'video' ? (
                            <>
                              <video
                                src={`${mediaItem?.mediaPath}`}
                                className="w-full h-full aspect-square object-contain"
                                loop
                                autoPlay
                                muted={isMuted}
                                playsInline
                                preload="auto"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute w-8 h-8 bottom-2 right-2 rounded-full bg-black/50 hover:bg-black/70"
                                onClick={() => setIsMuted(!isMuted)}
                              >
                                {isMuted ? (
                                  <VolumeX className="h-4 w-4 text-white" />
                                ) : (
                                  <Volume2 className="h-4 w-4 text-white" />
                                )}
                              </Button>
                            </>
                          ) : (
                            <img
                              src={`${mediaItem?.mediaPath}`}
                              alt={`Post `}
                              className="w-full h-full aspect-square object-cover rounded-sm object-top"
                              loading="lazy"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )
          :
          (
            <CardContent onDoubleClick={(e) => handleLike(e, post._id)} className="p-0 relative border-[.1px] h-[80vh] border-zinc-300 dark:border-zinc-800 rounded-sm overflow-hidden flex justify-center items-center">
              {post?.media[0]?.mediaType === 'video' ? (
                <>
                  <video
                    src={`${post?.media[0]?.mediaPath}`}
                    className="w-full h-full aspect-square object-contain"
                    loop
                    autoPlay
                    muted={isMuted}
                    playsInline
                    preload="auto"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute w-8 h-8 bottom-2 right-2 rounded-full bg-black/50 hover:bg-black/70"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-white" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </>
              ) : (
                <img
                  src={`${post?.media[0]?.mediaPath}`}
                  alt={`Post `}
                  className="w-full h-full aspect-square object-cover rounded-sm object-top"
                  loading="lazy"
                />
              )}
            </CardContent>
          )
        }
        <CardFooter className="flex flex-col items-start px-0 py-4 space-y-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2">
              <button onClick={(e) => handleLike(e, post._id)} variant="ghost" size="icon">
                {post?.likes?.includes(userDetails.id) ? <FaHeart className="w-6 h-6 text-red-500" /> : <Heart className="w-6 h-6 hover:scale-110 transition-transform" />}
              </button>
              <Button onClick={(e) => showComments(e, post)} variant="ghost" size="icon">
                <MessageCircle className="w-6 h-6 -rotate-90" />
              </Button>
              <Button variant="ghost" size="icon">
                <Send className="w-6 h-6" />
              </Button>
            </div>
            <button onClick={(e) => handleSavePosts(e, post._id)} variant="ghost" size="icon">
              {Array.isArray(savedPost) && savedPost.includes(post._id) ? <GoBookmarkFill size={25} className="dark:text-white" /> : <GoBookmark size={25} className="hover:text-zinc-800 dark:hover:text-zinc-500 transition-colors dark:text-white duration-100" />}
            </button>
          </div>
          <p className="text-sm font-semibold">
            {post?.likes?.length > 0 ? `${post?.likes?.length} likes` : ""}
          </p>
          <div className="text-sm">
            <p className="font-semibold">
              {post?.caption}
            </p>
            This is a sample caption for post . #instagram #clone
          </div>
          <button onClick={(e) => showComments(e, post)}
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-zinc-700"
          >
            {post?.comments?.length > 0 ? `View all ${post?.comments?.length} comments` : ""}
          </button>
        </CardFooter>
        <CommentForm postId={post._id} handleCommentSubmit={handleCommentSubmit} />
      </Card>
    </div>

  );
};

export default Post;