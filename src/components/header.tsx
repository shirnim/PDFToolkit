'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import UserNav from '@/components/user-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { Files } from 'lucide-react';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-lg items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Files className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">PDF Toolkit</span>
        </Link>
        <div className="flex items-center gap-4">
          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : user ? (
            <UserNav user={user} />
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
