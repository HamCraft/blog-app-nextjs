import mongoose, { Document, Schema } from "mongoose";

// Define the Post schema interface for TypeScript type checking
interface IPost extends Document {
  userId: string;
  content: string;
  createdAt: Date;
}

// Define the Post schema
const postSchema = new Schema<IPost>({
  userId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create a Post model with the schema
const Post = mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
