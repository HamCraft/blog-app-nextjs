"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

type Post = {
  _id: string;
  content: string;
};

const BlogList = () => {
  const { isLoaded, userId } = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/posts?userId=${userId}`);
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

    fetchPosts();
  }, [userId]);

  const handleAddPost = async () => {
    if (!newPost.trim() || !userId) return;

    try {
      const response = await fetch(`/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost.trim(), userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setPosts((prev) => [data, ...prev]);
        setNewPost("");
      } else {
        setError(data.error || "Failed to add post");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      setError("An error occurred while adding the post");
    }
  };

  const handleEditPost = async (id: string) => {
    if (!editingContent.trim()) return;

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setPosts((prev) =>
          prev.map((post) =>
            post._id === id ? { ...post, content: data.content } : post
          )
        );
        setEditingPostId(null);
        setEditingContent("");
      } else {
        setError(data.error || "Failed to edit post");
      }
    } catch (error) {
      console.error("Error editing post:", error);
      setError("An error occurred while editing the post");
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("An error occurred while deleting the post");
    }
  };

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-white text-center mb-10">
        My Blog Posts
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Add New Post */}
      <div className="mb-10">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new post..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white resize-none"
          rows={4}
        />
        <button
          onClick={handleAddPost}
          className="mt-4 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Add Post
        </button>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl "
          >
            {editingPostId === post._id ? (
              <div className="p-6">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white resize-none"
                  rows={4}
                />
                <button
                  onClick={() => handleEditPost(post._id)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-white text-lg mb-4">{post.content}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setEditingPostId(post._id);
                      setEditingContent(post.content);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* No Posts Message */}
      {posts.length === 0 && (
        <p className="text-gray-400 text-center mt-10 text-xl">
          No posts yet. Add one to get started!
        </p>
      )}
    </div>
  );
};

export default BlogList;

