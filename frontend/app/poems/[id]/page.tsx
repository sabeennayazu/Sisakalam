"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockPoems } from "../mockData";
import { extractImageColors } from "@/lib/extractImageColors";
import DynamicBlobBackground from "@/components/ui/DynamicBlobBackground";
import PoemStats from "@/components/Poems/PoemStats";
import Tags from "@/components/Poems/Tags";
import PoemTableOfContents from "@/components/Poems/PoemTableOfContents";
import ReviewsSection from "@/components/Stories/ReviewsSection";

interface PoemPageProps {
  params: Promise<{
    id: string;
  }>;
}

type TabType = "tableOfContent" | "reviews";

export default function PoemPage({ params }: PoemPageProps) {
  const [paramsResolved, setParamsResolved] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("tableOfContent");
  const [heroColors, setHeroColors] = useState({
    dominant: "#1f2937",
    secondary: "#111827",
    glow: "#374151",
  });

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
      setParamsResolved(true);
    });
  }, [params]);

  const poem = mockPoems[id || ""];

  useEffect(() => {
    if (!poem?.cover_image) return;

    async function loadColors() {
      const colors = await extractImageColors(poem.cover_image);
      setHeroColors(colors);
    }

    loadColors();
  }, [poem]);

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
      {/* Hero Section */}
      <section className="relative bg-[#1a1a1a] text-white py-16">
        <div className="relative z-10 mx-auto max-w-6xl px-8">
          <div className="flex flex-col md:flex-row gap-12">
            {/* COVER */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="relative h-[400px] w-[260px] overflow-hidden rounded-md shadow-2xl">
                <Image
                  src={poem.cover_image}
                  alt={poem.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* INFO */}
            <div className="flex flex-col justify-center max-w-3xl">
              <div className="mb-4">
                <span className="inline-block rounded-full border border-gray-700 bg-white/5 px-4 py-1.5 text-xs font-bold tracking-widest text-gray-300 uppercase">
                  {poem.genre}
                </span>
              </div>

              <div className="mb-4">
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-2">
                  {poem.title}
                </h1>
                <p className="text-xl text-gray-400 italic">
                  by {poem.author.name}
                </p>
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl line-clamp-3">
                {poem.content}
              </p>

              {/* STATS */}
              <div className="flex flex-wrap gap-8 md:gap-12 mb-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-lg font-bold">{(poem.views / 1000).toFixed(1)}K</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Views</span>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-lg font-bold">{(poem.likes / 1000).toFixed(1)}K</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Likes</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-lg font-bold">{(poem.comments / 1000).toFixed(1)}K</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Comments</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="text-lg font-bold">{(poem.bookmarks / 1000).toFixed(1)}K</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Bookmarks</span>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.177-15.177L7.646 10H14v4H7.646l3.177 3.177-1.414 1.414L3.818 13.004l-.014-.014L2 11.207l1.79-1.798.014-.014 5.59-5.59 1.415 1.415zM22 12h-6v2h6v-2z" />
                  </svg>
                  Read Now
                </button>
                <button className="flex items-center gap-2 rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors">
                  Add to Library
                </button>
                <button className="flex items-center justify-center rounded-full border border-gray-600 p-3.5 text-white hover:bg-white/5 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* TAB NAVIGATION */}
          <div className="mb-8 border-b border-gray-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("tableOfContent")}
                className={`pb-4 font-semibold text-lg transition-colors ${
                  activeTab === "tableOfContent"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Table of Content
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-4 font-semibold text-lg transition-colors ${
                  activeTab === "reviews"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Reviews
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEFT */}
            <div className="lg:col-span-2">
              {activeTab === "tableOfContent" && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-6">
                    The Poem
                  </p>
                  <PoemTableOfContents content={poem.content} />
                </div>
              )}

              {activeTab === "reviews" && (
                <ReviewsSection totalReviews={892} averageRating={4.92} reviewType="poem" />
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">
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
      </section>
    </div>
  );
}
