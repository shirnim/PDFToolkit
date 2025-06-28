'use client';

import Link from 'next/link';
import { Files } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Files className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">PDF Toolkit</span>
        </Link>
      </div>
    </header>
  );
}
