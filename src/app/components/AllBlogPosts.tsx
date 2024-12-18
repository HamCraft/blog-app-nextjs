"use client";

import { useState, useEffect } from "react";

type Post = {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
};

const AllBlogPosts = () => {

  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();

        if (response.ok) {
          setPosts(data);
        } else {
          setError(data.error || "Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("An error occurred while fetching posts");
      }
    };

    fetchAllPosts();
  }, []);
 

  return (
    <div className="max-w-6xl mx-auto  p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        All Recent Blog Posts Created By Users
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="p-6">
              <p className="text-white text-lg mb-4">{post.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>User ID: {post.userId.slice(0, 8)}...</span>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-gray-400 text-center mt-10 text-xl">
          No posts available. Be the first to create a post!
        </p>
      )}
    </div>
  );
};

export default AllBlogPosts;
