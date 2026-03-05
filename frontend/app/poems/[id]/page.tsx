"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockPoems } from "../mockData";
import { extractImageColors } from "@/lib/extractImageColors";
import DynamicBlobBackground from "@/components/ui/DynamicBlobBackground";
import PoemContent from "@/components/Poems/PoemContent";
import PoemStats from "@/components/Poems/PoemStats";
import Tags from "@/components/Poems/Tags";

interface PoemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PoemPage({ params }: PoemPageProps) {
  const [paramsResolved, setParamsResolved] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
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
      <DynamicBlobBackground imageUrl={poem.cover_image}>
        <section className="relative overflow-hidden py-26 text-white">
          {/* Dynamic Gradient Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${heroColors.dominant}, ${heroColors.secondary})`,
            }}
          />

          {/* Radial Glow */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background: `radial-gradient(circle at 70% 30%, ${heroColors.glow}, transparent 60%)`,
            }}
          />

          {/* Blur Glow Effect */}
          <div
            className="absolute -top-40 -right-40 w-[700px] h-[700px] blur-[140px] rounded-full opacity-60"
            style={{
              background: heroColors.glow,
            }}
          />

          {/* Blurred Cover Overlay */}
          <Image
            src={poem.cover_image}
            alt=""
            fill
            priority
            className="object-cover blur-3xl scale-125 opacity-30"
            sizes="100vw"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0" />

          {/* Bottom fade */}
          <div className="absolute bottom-0 w-full h-40 bg-linear-to-b from-transparent to-white" />

          {/* CONTENT */}
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* COVER */}
              <div className="relative h-[450px] w-full max-w-xs rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/20">
                <Image
                  src={poem.cover_image}
                  alt={poem.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* INFO */}
              <div className="md:col-span-2">
                <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-full border text-xs">
                  {poem.genre}
                </span>

                <h1 className="text-5xl font-semibold mt-4 mb-3">
                  {poem.title}
                </h1>

                <p className="text-white/80 mb-6">
                  by {poem.author.name}
                </p>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    ["Views", poem.views],
                    ["Likes", poem.likes],
                    ["Comments", poem.comments],
                    ["Bookmarks", poem.bookmarks],
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

                {/* BUTTONS */}
                <div className="flex gap-4">
                  <button className="px-8 py-3 bg-black text-white rounded-full font-semibold">
                    Read Now
                  </button>

                  <button className="px-8 py-3 bg-white/10 backdrop-blur border rounded-full">
                    Add to Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </DynamicBlobBackground>

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
