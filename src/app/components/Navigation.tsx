"use client";
import Link from "next/link";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export const Navigation = () => {
  
  return (
    
    <nav className="flex justify-between p-4 bg-black text-white text-3xl">
      <Link
        href="/"
        className="text-white"
      >
        Create A Blog Post
      </Link>

      <Link
        href="/ViewPosts"
        className="text-white"
      >
        View Blogs
      </Link>
      
      <SignedOut>
        <SignInButton mode="modal"  />
      </SignedOut>
      <SignedIn>
        <UserButton />
        
      </SignedIn>
    
    </nav>
    
  );
};