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
   <AllBlogPosts/>
  )
}
