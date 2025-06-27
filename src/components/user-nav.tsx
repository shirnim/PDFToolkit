'use client';

import { signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UserNav({ user }: { user: User }) {
  const { toast } = useToast();

  const handleSignOut = async () => {
    if (!auth) {
        toast({
            title: "Error Signing Out",
            description: "Authentication is not configured.",
            variant: "destructive",
        });
        return;
    }
    try {
        await signOut(auth);
        toast({
            title: "Signed Out",
            description: "You have been successfully signed out.",
        });
    } catch (error) {
        toast({
            title: "Error Signing Out",
            description: "There was an issue signing you out. Please try again.",
            variant: "destructive",
        })
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || ''} />}
            <AvatarFallback>
              {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
