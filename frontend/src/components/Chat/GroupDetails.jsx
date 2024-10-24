'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MessageCircle, Settings, Users } from "lucide-react";

export default function GroupDetails({ isOpen, setIsOpen }) { // Accept props to control visibility
  const groupMembers = [
    { id: 1, name: 'John Doe', avatar: '/placeholder.svg?height=40&width=40', status: 'Admin' },
    { id: 2, name: 'Jane Smith', avatar: '/placeholder.svg?height=40&width=40', status: 'Member' },
    { id: 3, name: 'Mike Johnson', avatar: '/placeholder.svg?height=40&width=40', status: 'Member' },
    { id: 4, name: 'Sarah Williams', avatar: '/placeholder.svg?height=40&width=40', status: 'Member' },
    { id: 5, name: 'Alex Brown', avatar: '/placeholder.svg?height=40&width=40', status: 'Member' },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Group Details</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Group Avatar" />
              <AvatarFallback>GP</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">Instagram Group</h2>
          <p className="text-center text-muted-foreground mb-4">Created by John Doe • 50 members</p>
          <div className="flex justify-center space-x-2 mb-6">
            <Button variant="outline" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        <ScrollArea className="pr-6">
          <h3 className="text-lg font-semibold mb-4">Group Members</h3>
          {groupMembers.map((member) => (
            <div key={member.id} className="flex items-center space-x-4 mb-4">
              <Avatar>
                <AvatarImage src={member.avatar} alt={`${member.name}'s Avatar`} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.status}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}


