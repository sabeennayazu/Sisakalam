'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getStoryById, getChaptersByStory } from '@/lib/mock-api';
import type { Story } from '@/mock/stories';
import type { Chapter } from '@/mock/chapters';

interface StoryPageProps {
  params: Promise<{ storyId: string }>;
}

export default function StoryPage({ params }: StoryPageProps) {
  const [paramResolved, setParamResolved] = useState(false);
  const [storyId, setStoryId] = useState<number | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Resolve params
  useEffect(() => {
    params.then((resolved) => {
      const id = parseInt(resolved.storyId, 10);
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
            className="mt-4 inline-block rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  const firstChapter = chapters[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 py-20 text-white">
        <div className="absolute inset-0">
          <Image
            src={story.cover_image}
            alt={story.title}
            fill
            className="object-cover opacity-20 blur-lg"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-gray-900 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Book Cover */}
            <div className="flex justify-center md:justify-start">
              <div className="relative h-80 w-56 overflow-hidden rounded-lg shadow-2xl">
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
            <div className="md:col-span-3 space-y-6">
              <div>
                <span className="inline-block rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold">
                  {story.genre}
                </span>
              </div>

              <div>
                <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                  {story.title}
                </h1>
                <p className="mt-3 text-lg text-gray-300">
                  by <span className="font-semibold">{story.author}</span>
                </p>
              </div>

              <p className="max-w-2xl text-gray-300">{story.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-gray-400">Views</p>
                  <p className="text-2xl font-bold">
                    {(story.views / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Likes</p>
                  <p className="text-2xl font-bold">
                    {(story.likes / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Chapters</p>
                  <p className="text-2xl font-bold">{chapters.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Bookmarks</p>
                  <p className="text-2xl font-bold">
                    {(story.bookmarks / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {firstChapter && (
                  <Link
                    href={`/stories/${story.id}/${firstChapter.slug}`}
                    className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white hover:bg-blue-700 transition-colors"
                  >
                    Read Now
                  </Link>
                )}
                <button className="rounded-lg border-2 border-white px-8 py-3 font-bold text-white hover:bg-white/10 transition-colors">
                  Add to Library
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
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
