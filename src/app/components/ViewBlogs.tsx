"use client"
import { useAuth } from '@clerk/nextjs';
import React from 'react'
import AllBlogPosts from './AllBlogPosts';

export default function ViewBlogs() {
    const { isLoaded, userId } = useAuth();

    if (!isLoaded || userId) {
        return null;
      }
    
  return (
    <div>
      <h1 className='text-white text-center mt-10 text-4xl'>Sign In To Create A Blog Post!</h1>
   <AllBlogPosts/>
   </div>
  )
}
