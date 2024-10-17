"'use client'"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function InstagramProfileSkeletonComponent() {
  return (
    (<div className="profile min-h-screen flex-grow px-4 sm:px-8 lg:px-[72px] py-[60px] ml-0 lg:ml-[14.5%] dark:bg-neutral-950 dark:text-white">
      {/* Profile Header */}
      <div className="flex items-center p-4 border-b">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="ml-4 flex-1">
          <Skeleton className="h-6 w-40 mb-2" />
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
      {/* Bio */}
      <div className="p-4 border-b">
        <Skeleton className="h-4 w-40 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      {/* Story Highlights */}
      <div className="flex space-x-4 p-4 overflow-x-auto border-b">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-14" />
          </div>
        ))}
      </div>
      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-around">
          <TabsTrigger value="posts" className="flex-1">
            <Skeleton className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="reels" className="flex-1">
            <Skeleton className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="tagged" className="flex-1">
            <Skeleton className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 p-1">
        {[...Array(9)].map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>)
  );
}