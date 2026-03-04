"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockPoems } from "../mockData";
import PoemContent from "@/components/Poems/PoemContent";
import PoemStats from "@/components/Poems/PoemStats";
import Tags from "@/components/Poems/Tags";

interface PoemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PoemPage({ params }: PoemPageProps) {
  const [paramsResolved, setParamsResolved] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
      setParamsResolved(true);
    });
  }, [params]);

  const poem = mockPoems[id || ""];

  // Calculate word count and reading time
  const wordCount = React.useMemo(() => {
    if (!poem) return 0;
    return poem.content.split(/\s+/).length;
  }, [poem]);

  const readingTime = React.useMemo(() => {
    return Math.ceil(wordCount / 200);
  }, [wordCount]);

  // Loading state
  if (!paramsResolved || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!poem || !poem.id) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gray-900">
            Poem Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the poem you're looking for.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const publicationDate = new Date(poem.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Green Gradient Background */}
      <div className="bg-linear-to-b from-green-900 to-green-700 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Cover Image */}
            <div className="md:col-span-1">
              <div className="relative h-64 md:h-80 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={poem.cover_image}
                  alt={poem.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop";
                  }}
                />
              </div>
            </div>

            {/* Title and Info */}
            <div className="md:col-span-2">
              <div className="mb-4 flex gap-2">
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur uppercase">
                  Original
                </span>
              </div>
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur">
                  {poem.genre}
                </span>
                {poem.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-white/10 text-white px-3 py-1 rounded-full text-xs backdrop-blur"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {poem.title}
              </h1>
              <p className="text-white/90 mb-6 text-lg">
                by <strong>{poem.author.name}</strong>
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Views
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(poem.views / 1000).toFixed(1)}K
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Likes
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(poem.likes / 1000).toFixed(1)}K
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Comments
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(poem.comments / 1000).toFixed(1)}K
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Bookmarks
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(poem.bookmarks / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-white/90 text-green-900 font-bold rounded-lg hover:bg-white transition-colors">
                  ADD TO LIBRARY
                </button>
                <button
                  onClick={() => {
                    if (!isLiked) {
                      setLikes(poem.likes + 1);
                      setIsLiked(true);
                    } else {
                      setLikes(poem.likes - 1);
                      setIsLiked(false);
                    }
                  }}
                  className={`px-8 py-3 font-bold rounded-lg transition-colors ${
                    isLiked
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {isLiked ? "❤ LIKED" : "🤍 LIKE"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content - The Poem */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-6">
                The Poem
              </p>
              <PoemContent content={poem.content} />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats and Rating */}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-4">
                Stats & Rating
              </p>
              <PoemStats
                rating={4.92}
                reviewCount={892}
                publicationDate={publicationDate}
                wordCount={wordCount}
                readingTime={readingTime}
              />
            </div>

            {/* Tags */}
            <Tags tags={poem.tags} />

            {/* Report Content */}
            <button className="w-full px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm">
              🚩 REPORT CONTENT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
