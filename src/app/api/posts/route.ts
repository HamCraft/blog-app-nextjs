import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Post from "@/lib/models/Post";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { content, userId } = await req.json();

    const newPost = new Post({ content, userId });
    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let posts;
    if (userId) {
      // If userId is provided, fetch posts for that user
      posts = await Post.find({ userId }).sort({ createdAt: -1 });
    } else {
      // If no userId is provided, fetch all posts
      posts = await Post.find().sort({ createdAt: -1 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Error fetching posts" }, { status: 500 });
  }
}

