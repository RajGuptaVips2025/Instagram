import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Bookmark, Send, MoreHorizontal } from "lucide-react"

export default function PostOpener({ isModalOpen, setIsModalOpen, selectedPost, posts }) {


  return (
    <div className="container mx-auto p-4">
      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="cursor-pointer"
            onClick={() => openModal(post)}
          >
            <img
              src={post.imageUrl}
              alt={`Post by ${post.user}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Modal for Selected Post */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {selectedPost && (
          <DialogContent className="sm:max-w-[1000px] h-[600px] p-0 flex">
            {/* Left Side: Post Image */}
            <div className="w-2/4 bg-black h-full">
              {selectedPost.mediaType === "image" ? <img
                src={selectedPost.mediaPath}
                alt={`Post by ${selectedPost.user}`}
                className="w-full h-full object-cover"
              /> : <video
                src={selectedPost.mediaPath}
                lt={`Post by ${selectedPost.user}`}
                controls
                className="w-full h-full aspect-square object-cover"
              />}
            </div>

            {/* Right Side: Post Details */}
            <div className="w-2/4 flex flex-col h-full relative">
              {/* Close Button */}
              {/* Header: Avatar, Username, Options */}
              <div className="flex justify-between items-center px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={selectedPost.author.avatar} className="object-cover" />
                    <AvatarFallback>{selectedPost.author.username[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{selectedPost.author.username}</span>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>

              {/* Comments Section */}
              <ScrollArea className="flex-grow px-4 py-2">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index} className="text-sm mb-2">
                    <span className="font-semibold">{comment.user}</span>{" "}
                    {comment.text}
                  </div>
                ))}
              </ScrollArea>

              {/* Post Actions */}
              <div className="flex justify-between items-center px-4 py-2">
                <div className="flex space-x-4">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>

              {/* Likes and Caption */}
              <div className="px-4 py-2 border-t">
                <p className="text-sm font-semibold">
                  {selectedPost.likes.length} likes
                </p>
                <p className="text-sm">
                  <span className="font-semibold">{selectedPost.user}</span>{" "}
                  {selectedPost.caption}
                </p>
              </div>

              {/* Date */}
              <p className="px-4 py-2 text-xs text-gray-500">
                {new Date(selectedPost.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}