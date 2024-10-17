// Reels.js
import { useRef, useState } from 'react';
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Stories = () => {

  const [showAllStories, setShowAllStories] = useState(false)
  const [selectedStory, setSelectedStory] = useState(null)
  const stories = Array(20).fill(null).map((_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    avatar: `https://i.pravatar.cc/64?img=${i + 1}`
  }))
  const containerRef = useRef(null);

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mt-1">
      <ScrollArea className="w-11/12 whitespace-nowrap">
        <div ref={containerRef} className="flex space-x-4 p-1 ">
          {stories.map((story) => (
            <button
              key={story.id}
              className="flex flex-col items-center space-y-1"
              onClick={() => setSelectedStory(story)}
            >
              <div className="rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                <Avatar className="w-16 h-16 border-2 border-background">
                  <AvatarImage src={story.avatar} />
                  <AvatarFallback>{story.username[0]}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs">{story.username}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default Stories;