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
        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/about" className="text-sm font-medium hover:underline">
            About
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm font-medium hover:underline"
          >
            How it Works
          </Link>
          <Link href="/faq" className="text-sm font-medium hover:underline">
            FAQ
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:underline">
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
