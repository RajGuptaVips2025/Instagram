import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, UserPlus } from "lucide-react"

export default function Notification() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'like', user: 'johndoe', avatar: '/placeholder.svg?height=32&width=32', content: 'liked your post.', time: '2m' },
    { id: 2, type: 'comment', user: 'janedoe', avatar: '/placeholder.svg?height=32&width=32', content: 'commented on your photo.', time: '5m' },
    { id: 3, type: 'follow', user: 'mikesmith', avatar: '/placeholder.svg?height=32&width=32', content: 'started following you.', time: '10m' },
    { id: 4, type: 'like', user: 'sarahlee', avatar: '/placeholder.svg?height=32&width=32', content: 'liked your comment.', time: '15m' },
    { id: 5, type: 'comment', user: 'alexwong', avatar: '/placeholder.svg?height=32&width=32', content: 'mentioned you in a comment.', time: '30m' },
  ])

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-500" />
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={notification.avatar} alt={notification.user} />
                <AvatarFallback>{notification.user.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{notification.user}</span> {notification.content}
                </p>
                <p className="text-xs text-muted-foreground">{notification.time}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getIcon(notification.type)}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Action</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}