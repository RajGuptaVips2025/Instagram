"'use client'"

import { Skeleton } from "@/components/ui/skeleton"

export function InstagramSkeletonComponent() {
  return (
    (<div className="max-w-lg mx-auto dark:bg-black">
      {/* Header */}
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
      {/* Posts */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border-b pb-4 mb-4">
          {/* Post header */}
          <div className="flex items-center space-x-2 py-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-44 rounded-full" />
          </div>

          {/* Post image */}
          <Skeleton className="h-[80vh] w-full" />

          {/* Post actions */}
          <div className="flex items-center space-x-4 py-2">
            <Skeleton className="h-6 w-6 " />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>

          {/* Likes */}
          <div className=" py-2">
            <Skeleton className="h-4 w-28" />
          </div>

          {/* Caption */}
          <div className="">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </div>

          {/* Comments */}
          <div className=" mt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>)
  );
}