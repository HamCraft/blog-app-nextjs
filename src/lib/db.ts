import mongoose from "mongoose";

const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    // Connect to MongoDB using the connection string from the environment variables
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined in .env.local");
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
