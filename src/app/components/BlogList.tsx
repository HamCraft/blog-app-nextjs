"use client"
import { useAuth,} from "@clerk/nextjs";
import { useState } from "react";


type Post = {
  id: number;
  content: string;
};

const BlogList = () => {

  const {isLoaded, userId} = useAuth();

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<string>("");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    setPosts((prev) => [
      ...prev,
      { id: Date.now(), content: newPost.trim() },
    ]);
    setNewPost("");
  };

  const handleEditPost = (id: number) => {
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, content: editingContent.trim() } : post
    );
    setPosts(updatedPosts);
    setEditingPostId(null);
    setEditingContent("");
  };

  const handleDeletePost = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  if(!isLoaded || !userId ){
    return null;
}

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        To-Do Style Blog
      </h1>
      
      {/* Add New Post */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new post..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        <button
          onClick={handleAddPost}
          className="px-5 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-400 transition"
        >
          Add Post
        </button>
      </div>

      {/* Posts List */}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-gray-100 rounded-lg shadow-sm"
          >
            {editingPostId === post.id ? (
              <>
                <input
                  type="text"
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-400"
                />
                <button
                  onClick={() => handleEditPost(post.id)}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-400 transition"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-gray-700 break-words">{post.content}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingPostId(post.id);
                      setEditingContent(post.content);
                    }}
                    className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-md hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="px-4 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* No Posts Message */}
      {posts.length === 0 && (
        <p className="text-gray-500 text-center mt-6">
          No posts yet. Add one to get started!
        </p>
      )}
    </div>
  );
};

export default BlogList;

