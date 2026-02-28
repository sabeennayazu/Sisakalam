"use client";

import AuthGuard from "@/components/AuthGuard";
import Navbar from "@/components/Navbar/Navbar";
import StoriesByGenre from "@/components/Sections/stories/genre/StoriesByGenre";
import PoemsByMood from "@/components/Sections/poems/genre/PoemsByMood";
import RecommendedStories from "@/components/Sections/stories/personalized/RecommendedStories";
import RecommendedPoems from "@/components/Sections/poems/personalized/RecommendedPoems";

export default function HomePage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-white  ">
        <Navbar />
        <div className="py-18 px-2">
          <StoriesByGenre />
          <PoemsByMood />
          <RecommendedStories />
          <RecommendedPoems />
        </div>
      </div>
    </AuthGuard>
  );
}
