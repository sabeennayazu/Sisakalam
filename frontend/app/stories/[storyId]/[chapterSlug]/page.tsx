'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Book,
  Settings,
  MessageCircle,
  ThumbsUp,
  Gift,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { getStoryById, getChapterBySlug, getChapterComments, getChaptersByStory } from '@/lib/mock-api';
import type { Story } from '@/mock/stories';
import type { Chapter } from '@/mock/chapters';
import type { Comment } from '@/mock/comments';
import ReadingObserver from '@/components/reading/ReadingObserver';
import ChapterListPanel from '@/components/sidebar/ChapterListPanel';
import ReaderSettingsPanel from '@/components/sidebar/ReaderSettingsPanel';
import ChapterCommentsPanel from '@/components/sidebar/ChapterCommentsPanel';
import { useReadingSettings } from '@/hooks/useReadingSettings';

interface PageProps {
  params: Promise<{ storyId: string; chapterSlug: string }>;
}

export default function ChapterReadingPage({ params }: PageProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [paramsResolved, setParamsResolved] = useState(false);
  const [storyId, setStoryId] = useState<number | null>(null);
  const [chapterSlug, setChapterSlug] = useState<string | null>(null);

  const [story, setStory] = useState<Story | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Sidebar state
  const [showChapters, setShowChapters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { getBackgroundClass, getCSSVars } = useReadingSettings();
  const contentRef = useRef<HTMLDivElement>(null);

  // Resolve params
  useEffect(() => {
    params.then((resolved) => {
      setStoryId(parseInt(resolved.storyId, 10));
      setChapterSlug(resolved.chapterSlug);
      setParamsResolved(true);
    });
  }, [params]);

  // Fetch story and chapter data
  useEffect(() => {
    if (!paramsResolved || storyId === null || chapterSlug === null) return;

    const fetchedStory = getStoryById(storyId);
    if (fetchedStory) {
      setStory(fetchedStory);

      const fetchedChapters = getChaptersByStory(storyId);
      setChapters(fetchedChapters);

      const fetchedChapter = getChapterBySlug(storyId, chapterSlug);
      if (fetchedChapter) {
        setChapter(fetchedChapter);
        const chapterComments = getChapterComments(fetchedChapter.id);
        setComments(chapterComments);
      }
    }
  }, [paramsResolved, storyId, chapterSlug]);

  // Handle chapter navigation
  const handleNextChapter = useCallback(() => {
    if (chapter && chapter.next_chapter) {
      router.push(`/stories/${storyId}/${chapter.next_chapter}`);
    }
  }, [chapter, storyId, router]);

  const handlePreviousChapter = useCallback(() => {
    if (chapter && chapter.previous_chapter) {
      router.push(`/stories/${storyId}/${chapter.previous_chapter}`);
    }
  }, [chapter, storyId, router]);

  const handleSelectChapter = useCallback(
    (chapterNumber: number) => {
      const targetChapter = chapters.find(
        (ch) => ch.chapter_number === chapterNumber,
      );
      if (targetChapter) {
        router.push(`/stories/${storyId}/${targetChapter.slug}`);
        setShowChapters(false);
      }
    },
    [chapters, storyId, router],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !paramsResolved) {
    return null;
  }

  if (!story || !chapter) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Chapter not found</h1>
          <p className="mt-2 text-gray-600">
            The chapter you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const currentChapterIndex = chapters.findIndex((ch) => ch.id === chapter.id);
  const totalChapters = chapters.length;
  const progress = ((currentChapterIndex + 1) / totalChapters) * 100;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${getBackgroundClass()}`}
      style={getCSSVars() as React.CSSProperties}
    >
      {/* Main Content */}
      <div className="flex">
        {/* Left Margin */}
        <div className="hidden flex-1 md:block" />

        {/* Reading Content */}
        <div
          ref={contentRef}
          className="w-full max-w-2xl px-6 py-12 md:max-w-3xl md:px-8"
          style={{
            fontFamily: 'var(--reading-font-family)',
            fontSize: 'var(--reading-font-size)',
          }}
        >
          {/* Reading Observer - Top */}
          <ReadingObserver onNearTop={() => {}} onNearBottom={() => {}} />

          {/* Chapter Header */}
          <div className="mb-12">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Chapter {chapter.chapter_number}: {chapter.title}
            </h1>
            <p className="text-sm text-gray-500">
              {new Date(chapter.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Chapter Content */}
          <article className="prose prose-lg max-w-none text-gray-800">
            {chapter.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6 leading-8">
                {paragraph}
              </p>
            ))}
          </article>

          {/* Reading Observer - Bottom */}
          <ReadingObserver onNearTop={() => {}} onNearBottom={() => {}} />

          {/* Chapter Actions */}
          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="mb-8 flex justify-center gap-8">
              {/* Comment Button */}
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="h-6 w-6" />
                <span className="text-sm font-semibold">COMMENT</span>
                {comments.length > 0 && (
                  <span className="text-xs text-gray-500">{comments.length}</span>
                )}
              </button>

              {/* Vote Button */}
              <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <ThumbsUp className="h-6 w-6" />
                <span className="text-sm font-semibold">VOTE</span>
              </button>

              {/* Send Gift Button */}
              <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Gift className="h-6 w-6" />
                <span className="text-sm font-semibold">SEND GIFT</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex justify-between border-t border-gray-200 pt-6">
            <button
              onClick={handlePreviousChapter}
              disabled={!chapter.previous_chapter}
              className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>
                Chapter {chapter.chapter_number} of {totalChapters}
              </p>
            </div>

            <button
              onClick={handleNextChapter}
              disabled={!chapter.next_chapter}
              className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden flex-1 md:flex md:justify-end">
          <div className="fixed right-0 top-1/2 -translate-y-1/2 space-y-3 pr-4">
            {/* Chapters Button */}
            <button
              onClick={() => setShowChapters(!showChapters)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-transform hover:scale-110 hover:bg-blue-700 text-white"
              title="Chapters"
            >
              <Book className="h-5 w-5" />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 shadow-lg transition-transform hover:scale-110 hover:bg-gray-700 text-white"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* Comments Button */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 shadow-lg transition-transform hover:scale-110 hover:bg-green-700 text-white"
              title="Comments"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Sidebar Panels */}
      <ChapterListPanel
        chapters={chapters}
        currentChapterNumber={chapter.chapter_number}
        onSelectChapter={handleSelectChapter}
        isOpen={showChapters}
        onClose={() => setShowChapters(false)}
      />

      <ReaderSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <ChapterCommentsPanel
        chapterId={chapter.id}
        chapterNumber={chapter.chapter_number}
        comments={comments}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
}
