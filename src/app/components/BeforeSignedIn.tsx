"use client";
import { useAuth } from "@clerk/nextjs";

export const BeforeSignedIn = () => {
  const { isLoaded, userId } = useAuth();

  // Show message only when fully loaded and user is signed out
  if (!isLoaded || userId) {
    return null;
  }

  return (
    <div className="text-white place-content-center text-center min-h-screen text-5xl">
      <h1>
      Welcome To My Blog Post
      , Sign in to start Blogging!
      </h1>
    </div>
  );
};
