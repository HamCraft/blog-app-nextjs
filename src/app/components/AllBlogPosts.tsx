"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Post = {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
};

const POSTS_TO_DISPLAY = 6;

const AllBlogPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (response.ok) {
          const sortedPosts = data.sort((a: Post, b: Post) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setPosts(sortedPosts);
          setDisplayedPosts(sortedPosts.slice(0, POSTS_TO_DISPLAY));
        } else {
          console.error("Failed to fetch posts:", data);
          setError(data.error || "Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("An error occurred while fetching posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const handleViewMore = () => {
    setDisplayedPosts(posts);
  };

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        All Blog Posts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedPosts.map((post) => (
          <Card key={post._id} className="bg-gray-800 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 whitespace-pre-wrap break-words">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-gray-400">
              <span>User ID: {post.userId.slice(0, 8)}...</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {posts.length > POSTS_TO_DISPLAY && displayedPosts.length === POSTS_TO_DISPLAY && (
        <div className="text-center mt-8">
          <Button onClick={handleViewMore} variant="secondary" className="px-6 py-2">
            View More Posts
          </Button>
        </div>
      )}

      {posts.length === 0 && (
        <p className="text-gray-400 text-center mt-10 text-xl">
          No posts available. Be the first to create a post!
        </p>
      )}
    </div>
  );
};

export default AllBlogPosts;

