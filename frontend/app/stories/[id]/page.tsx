'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStoryById, getChaptersByStory } from '@/lib/mock-api';
import type { Story } from '@/mock/stories';
import type { Chapter } from '@/mock/chapters';
import { mockStories } from '../mockData';

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default function StoryPage({ params }: StoryPageProps) {
  const [paramResolved, setParamResolved] = useState(false);
  const [storyId, setStoryId] = useState<number | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Resolve params
  useEffect(() => {
    params.then((resolved) => {
      const id = parseInt(resolved.id, 10);
      setStoryId(id);
      setParamResolved(true);
    });
  }, [params]);

  // Fetch story and chapters
  useEffect(() => {
    if (!paramResolved || storyId === null) return;

    const fetchedStory = getStoryById(storyId);
    if (fetchedStory) {
      setStory(fetchedStory);
      const fetchedChapters = getChaptersByStory(storyId);
      setChapters(fetchedChapters);
    }
  }, [paramResolved, storyId]);

  if (!paramResolved) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Story not found</h1>
          <p className="mt-2 text-gray-600">
            The story you're looking for doesn't exist.
          </p>
          <Link
            href="/stories"
            className="mt-4 inline-block rounded bg-black px-6 py-2 text-white"
          >
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const firstChapter = chapters[0];

  return (
    <div className="min-h-screen bg-white ">
      {/* Hero Section */}
      <section className="relative bg-[#1a1a1a] text-white py-16">
        <div className="relative z-10 mx-auto max-w-6xl px-8">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Book Cover */}
            <div className="flex-shrink-0 flex justify-center md:justify-start">
              <div className="relative h-[400px] w-[260px] overflow-hidden rounded-md shadow-2xl">
                <Image
                  src={story.cover_image}
                  alt={story.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Story Info */}
            <div className="flex flex-col justify-center max-w-3xl">
              <div className="mb-4">
                <span className="inline-block rounded-full border border-gray-700 bg-white/5 px-4 py-1.5 text-xs font-bold tracking-widest text-gray-300 uppercase">
                  {story.genre}
                </span>
              </div>

              <div className="mb-4">
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-2">
                  {story.title}
                </h1>
                <p className="text-xl text-gray-400 italic">
                  by {story.author}
                </p>
              </div>

              <p className="text-gray-300 text-base leading-relaxed mb-8 max-w-2xl">
                {story.description}{" "}
                <button className="text-blue-400 hover:text-blue-300 ml-1">
                  Read more
                </button>
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 md:gap-12 mb-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-lg font-bold">{(story.views / 1000).toFixed(1)}K</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Views</span>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-lg font-bold">{(story.likes / 1000).toFixed(1)}K</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Likes</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="text-lg font-bold">{chapters.length}</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Chapters</span>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="text-lg font-bold">{(story.bookmarks / 1000).toFixed(1)}K</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Bookmarks</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                {firstChapter && (
                  <Link
                    href={`/stories/${story.id}/${firstChapter.slug}`}
                    className="flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.177-15.177L7.646 10H14v4H7.646l3.177 3.177-1.414 1.414L3.818 13.004l-.014-.014L2 11.207l1.79-1.798.014-.014 5.59-5.59 1.415 1.415zM22 12h-6v2h6v-2z" />
                    </svg>
                    Read Now
                  </Link>
                )}
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

      {/* Chapters Section */}
      <section className="mx-auto max-w-6xl px-8 py-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          Chapters ({chapters.length})
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/stories/${story.id}/${chapter.slug}`}
              className="group rounded-lg border border-gray-200 p-4 hover:border-blue-600 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                    Chapter {chapter.chapter_number}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {chapter.title}
                  </p>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {new Date(chapter.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}