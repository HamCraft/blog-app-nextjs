"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8">
        My Blog Posts
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Add New Post */}
      <Card className="mb-8 bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-xl">Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Write a new post..."
            className="w-full px-4 py-3 bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-md resize-none"
            rows={4}
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddPost} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Add Post
          </Button>
        </CardFooter>
      </Card>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <Card key={post._id} className="bg-gray-800 text-white border-gray-700 shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
              {editingPostId === post._id ? (
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-md resize-none"
                  rows={4}
                />
              ) : (
                <p className="text-gray-300 whitespace-pre-wrap break-words">{post.content}</p>
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap justify-end gap-2">
              {editingPostId === post._id ? (
                <Button onClick={() => handleEditPost(post._id)} variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">
                  Save
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setEditingPostId(post._id);
                      setEditingContent(post.content);
                    }}
                    variant="secondary"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => handleDeletePost(post._id)} variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                    Delete
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Posts Message */}
      {posts.length === 0 && (
        <p className="text-gray-400 text-center mt-8 text-xl">
          No posts yet. Add one to get started!
        </p>
      )}
    </div>
  );
};

export default BlogList;

