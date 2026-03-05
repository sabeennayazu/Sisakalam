"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { mockStories } from "../mockData";

import LatestUpdates from "@/components/Stories/LatestUpdates";
import StatsAndRating from "@/components/Stories/StatsAndRating";
import SynopsisSection from "@/components/Stories/SynopsisSection";
import TableOfContents from "@/components/Stories/TableOfContents";
import ReviewsSection from "@/components/Stories/ReviewsSection";

type TabType = "synopsis" | "contents" | "reviews";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default function StoryPage({ params }: StoryPageProps) {
  const [paramsResolved, setParamsResolved] = useState(false);
  const [id, setId] = useState<string | null>(null);

  const [activeTab, setActiveTab] =
    useState<TabType>("synopsis");

  const [selectedChapterId, setSelectedChapterId] =
    useState("");

  /* ================= PARAM RESOLVE ================= */

  useEffect(() => {
    params.then((resolved) => {
      setId(resolved.id);
      setParamsResolved(true);
    });
  }, [params]);

  const story = mockStories[id || ""];

  /* ================= CURRENT CHAPTER ================= */

  const currentChapter = useMemo(() => {
    if (!story) return null;

    if (!selectedChapterId)
      return story.chapters[0];

    return (
      story.chapters.find(
        (c) => c.chapter_id === selectedChapterId
      ) || story.chapters[0]
    );
  }, [selectedChapterId, story]);

  /* ================= LATEST UPDATES ================= */

  const latestUpdates = useMemo(() => {
    if (!story?.chapters) return [];

    return story.chapters
      .slice(-3)
      .reverse()
      .map((ch) => ({
        title: `Chapter ${ch.chapter_number}: ${ch.chapter_title}`,
        date: new Date(
          ch.created_at
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
  }, [story]);

  /* ================= STATES ================= */

  if (!paramsResolved || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!story) {
    return <div>Story Not Found</div>;
  }

  /* ================= PAGE ================= */

  return (
    <div className="min-h-screen bg-white">

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden py-26 text-white">

        {/* Blurred Background from Cover */}
        <Image
          src={story.image}
          alt=""
          fill
          priority
          className="object-cover blur-3xl scale-125 opacity-40"
          sizes="100vw"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Bottom Fade Into White */}
        <div className="absolute bottom-0 w-full h-40 bg-gradient-to-b from-transparent to-white" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Cover */}
            <div className="relative h-[480px] w-full max-w-xs rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="md:col-span-2">

              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs">
                {story.genre}
              </span>

              <h1 className="text-5xl font-bold mt-4 mb-3">
                {story.title}
              </h1>

              <p className="text-white/80 mb-6">
                by {story.author.name}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  ["Views", story.views],
                  ["Likes", story.likes],
                  ["Comments", story.comments],
                  ["Bookmarks", story.bookmarks],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-4"
                  >
                    <p className="text-xs text-white/70">
                      {label}
                    </p>
                    <p className="text-2xl font-bold">
                      {(Number(value) / 1000).toFixed(1)}K
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-black text-white rounded-full font-bold">
                  Read Now
                </button>

                <button className="px-8 py-3 bg-white/20 backdrop-blur rounded-full">
                  Add to Library
                </button>
              </div>

              <div className="mt-6">
                <span className="bg-orange-500 px-4 py-2 rounded-full text-xs font-bold">
                  🔥 #1 POWER RANKING
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}

      <div className="max-w-6xl mx-auto px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT */}
          <div className="lg:col-span-2">

            {activeTab === "synopsis" && (
              <SynopsisSection synopsis={story.synopsis} />
            )}

            {activeTab === "contents" && (
              <TableOfContents
                chapters={story.chapters}
                onSelectChapter={(id) => {
                  setSelectedChapterId(id);
                  setActiveTab("synopsis");
                }}
              />
            )}

            {activeTab === "reviews" && (
              <ReviewsSection
                totalReviews={6464}
                averageRating={4.71}
              />
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            <StatsAndRating
              rating={4.71}
              reviewCount={6464}
              totalChapters={story.chapters.length}
              status="Ongoing"
              dailyUpdates={2}
            />

            {/* TAGS */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">
                TAGS
              </h3>

              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <LatestUpdates updates={latestUpdates} />

          </div>
        </div>
      </div>
    </div>
  );
}