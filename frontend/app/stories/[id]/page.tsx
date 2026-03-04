"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockStories } from "../mockData";
import SynopsisSection from "@/components/Stories/SynopsisSection";
import TableOfContents from "@/components/Stories/TableOfContents";
import ReviewsSection from "@/components/Stories/ReviewsSection";
import StatsAndRating from "@/components/Stories/StatsAndRating";
import LatestUpdates from "@/components/Stories/LatestUpdates";

type TabType = "synopsis" | "contents" | "reviews";

interface StoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StoryPage({ params }: StoryPageProps) {
  const [paramsResolved, setParamsResolved] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("synopsis");
  const [selectedChapterId, setSelectedChapterId] = useState<string>("");

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
      setParamsResolved(true);
    });
  }, [params]);

  const story = mockStories[id || ""];

  const currentChapter = React.useMemo(() => {
    if (!story || !story.chapters) return null;
    if (!selectedChapterId && story.chapters.length > 0) {
      return story.chapters[0];
    }
    return story.chapters.find((ch) => ch.chapter_id === selectedChapterId) || null;
  }, [selectedChapterId, story]);

  const latestUpdates = React.useMemo(() => {
    if (!story || !story.chapters) return [];
    return story.chapters.slice(-3).map((ch) => ({
      title: `Chapter ${ch.chapter_number}: ${ch.chapter_title}`,
      date: new Date(ch.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [story]);

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
  if (!story || !story.id) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-24 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gray-900">
            Story Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, we couldn't find the story you're looking for.
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Cover and Info */}
      <div className="bg-linear-to-b from-green-900 to-green-700 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Cover Image */}
            <div className="md:col-span-1">
              <div className="relative h-64 md:h-80 bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={story.cover_image}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=700&fit=crop";
                  }}
                />
              </div>
            </div>

            {/* Title and Info */}
            <div className="md:col-span-2">
              <div className="mb-4">
                <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {story.genre}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {story.title}
              </h1>
              <p className="text-white/90 mb-6 text-lg">by {story.author.name}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Views
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(story.views / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Likes
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(story.likes / 1000).toFixed(1)}K
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Comments
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(story.comments / 1000).toFixed(1)}K
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <div className="text-white/70 text-xs uppercase tracking-wider mb-1">
                    Bookmarks
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {(story.bookmarks / 1000).toFixed(1)}K
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-colors">
                  Read Now
                </button>
                <button className="px-8 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors backdrop-blur">
                  Add to Library
                </button>
              </div>

              {/* Ranking Badge */}
              <div className="mt-6">
                <span className="inline-block bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold">
                  🔥 #1 POWER RANKING
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("synopsis")}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeTab === "synopsis"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Synopsis
            </button>
            <button
              onClick={() => setActiveTab("contents")}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeTab === "contents"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Table of Contents
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                activeTab === "reviews"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Reviews (6,464)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Content - Main */}
          <div className="lg:col-span-2">
            {activeTab === "synopsis" && (
              <SynopsisSection synopsis={story.synopsis} />
            )}
            {activeTab === "contents" && (
              <TableOfContents
                chapters={story.chapters}
                onSelectChapter={(chapterId) => {
                  setSelectedChapterId(chapterId);
                  setActiveTab("synopsis");
                }}
              />
            )}
            {activeTab === "reviews" && (
              <ReviewsSection totalReviews={6464} averageRating={4.71} />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats and Rating */}
            <StatsAndRating
              rating={4.71}
              reviewCount={6464}
              totalChapters={story.chapters.length}
              status="Ongoing"
              dailyUpdates={2}
            />

            {/* Tags */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">TAGS</h3>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Latest Updates */}
            <LatestUpdates updates={latestUpdates} />

            {/* Report Story */}
            <button className="w-full px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm">
              🚩 Report Story
            </button>
          </div>
        </div>

        {/* Chapter Reading Section - Below */}
        {currentChapter && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Chapter Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 bg-gray-50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Chapters
                  </h3>
                  <div className="space-y-2">
                    {story.chapters.map((chapter) => (
                      <button
                        key={chapter.chapter_id}
                        onClick={() => setSelectedChapterId(chapter.chapter_id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                          selectedChapterId === chapter.chapter_id
                            ? "bg-gray-900 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">
                          Ch. {chapter.chapter_number}
                        </div>
                        <div
                          className={`text-xs truncate ${
                            selectedChapterId === chapter.chapter_id
                              ? "text-gray-300"
                              : "text-gray-500"
                          }`}
                        >
                          {chapter.chapter_title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chapter Content */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-8 mb-8">
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                    {currentChapter.chapter_title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Chapter {currentChapter.chapter_number} •{" "}
                    {new Date(currentChapter.created_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                  <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line text-base">
                    {currentChapter.content}
                  </div>
                </div>

                {/* Chapter Navigation */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const currentIndex = story.chapters.findIndex(
                        (ch) => ch.chapter_id === currentChapter.chapter_id
                      );
                      if (currentIndex > 0) {
                        setSelectedChapterId(
                          story.chapters[currentIndex - 1].chapter_id
                        );
                      }
                    }}
                    disabled={
                      story.chapters[0].chapter_id === currentChapter.chapter_id
                    }
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    ← Previous Chapter
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = story.chapters.findIndex(
                        (ch) => ch.chapter_id === currentChapter.chapter_id
                      );
                      if (currentIndex < story.chapters.length - 1) {
                        setSelectedChapterId(
                          story.chapters[currentIndex + 1].chapter_id
                        );
                      }
                    }}
                    disabled={
                      story.chapters[story.chapters.length - 1].chapter_id ===
                      currentChapter.chapter_id
                    }
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Next Chapter →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
