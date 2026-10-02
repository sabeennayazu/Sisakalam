'use client';

import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, Settings, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import HeroSection from './HeroSection';
import ChapterContent from './ChapterContent';
import ChapterLoader from './ChapterLoader';
import ReadingObserver from './ReadingObserver';
import ChapterListPanel from '@/components/sidebar/ChapterListPanel';
import ReaderSettingsPanel from '@/components/sidebar/ReaderSettingsPanel';
import ChapterCommentsPanel from '@/components/sidebar/ChapterCommentsPanel';
import { ChapterData, ChapterReference, useContinuousChapters } from '@/hooks/useContinuousChapters';
import { useReadingSettings } from '@/hooks/useReadingSettings';
import { getStoryChapterBySlug } from '@/utils/stories.api';
import type { ChapterApiRecord } from '@/types';

interface ReadingLayoutProps {
  storyId: string;
  storyTitle: string;
  storyImage: string | null;
  storyAuthor: {
    id: string;
    name: string;
    profile_image?: string | null;
  };
  synopsis: string;
  likes: number;
  views: number;
  bookmarks: number;
  chapterIndex: ChapterReference[];
  initialChapters: ChapterData[];
  initialChapterNumber: number;
}

export default function ReadingLayout({
  storyId,
  storyTitle,
  storyImage,
  storyAuthor,
  synopsis,
  likes,
  views,
  bookmarks,
  chapterIndex,
  initialChapters,
  initialChapterNumber,
}: ReadingLayoutProps) {
  const router = useRouter();

  // Sidebar panels state
  const [showChapters, setShowChapters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Reading state
  const fetchChapter = useCallback(async (slug: string): Promise<ChapterData> => {
    const chapter = await getStoryChapterBySlug<ChapterApiRecord>(storyId, slug);
    return {
      id: chapter.id,
      slug: chapter.slug,
      title: chapter.title,
      chapter_number: chapter.chapter_number,
      content: chapter.content,
      created_at: chapter.created_at,
    };
  }, [storyId]);

  const handleChapterChange = useCallback((chapterNumber: number) => {
    const chapter = chapterIndex.find((item) => item.chapter_number === chapterNumber);
    if (chapter) {
      window.dispatchEvent(new CustomEvent('sisakalam:reader-route-sync', {
        detail: { storyId, chapterSlug: chapter.slug },
      }));
      router.replace(`/stories/${storyId}/${chapter.slug}`, { scroll: false });
    }
  }, [chapterIndex, router, storyId]);

  const {
    chapters,
    currentChapterNumber,
    isLoadingPrevious,
    isLoadingNext,
    error,
    hasPrevious,
    hasNext,
    loadChapter,
    setCurrentChapter,
    loadMoreChapters,
  } = useContinuousChapters(initialChapters, chapterIndex, initialChapterNumber, fetchChapter, handleChapterChange);

  const readingSettings = useReadingSettings();
  const { getCSSVars, getBackgroundClass } = readingSettings;

  const contentRef = useRef<HTMLDivElement>(null);
  const savedScrollTopRef = useRef<number | null>(null);
  const savedScrollHeightRef = useRef<number | null>(null);
  const isLoadingPreviousRef = useRef(isLoadingPrevious);

  useLayoutEffect(() => {
    isLoadingPreviousRef.current = isLoadingPrevious;
  }, [isLoadingPrevious]);

  useEffect(() => {
    if (initialChapterNumber === 1) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(`chapter-${initialChapterNumber}`)?.scrollIntoView({ block: 'start' });
      if (hasPrevious) {
        savedScrollTopRef.current = window.scrollY;
        savedScrollHeightRef.current = document.body.scrollHeight;
        window.requestAnimationFrame(() => {
          if (isLoadingPreviousRef.current) return;
          savedScrollTopRef.current = null;
          savedScrollHeightRef.current = null;
        });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [hasPrevious, initialChapterNumber]);

  useLayoutEffect(() => {
    if (savedScrollTopRef.current === null || savedScrollHeightRef.current === null) return;
    const heightChange = document.body.scrollHeight - savedScrollHeightRef.current;
    window.scrollTo({ top: savedScrollTopRef.current + heightChange, behavior: 'auto' });
    savedScrollTopRef.current = window.scrollY;
    savedScrollHeightRef.current = document.body.scrollHeight;
  }, [chapters.length]);

  useEffect(() => {
    if (isLoadingPrevious || savedScrollTopRef.current === null) return;
    savedScrollTopRef.current = null;
    savedScrollHeightRef.current = null;
  }, [isLoadingPrevious]);

  const handleNearBottom = useCallback(() => {
    if (hasNext && !isLoadingNext) void loadMoreChapters('next');
  }, [hasNext, isLoadingNext, loadMoreChapters]);

  const handleNearTop = useCallback(() => {
    if (hasPrevious && !isLoadingPrevious) {
      savedScrollTopRef.current = window.scrollY;
      savedScrollHeightRef.current = document.body.scrollHeight;
      void loadMoreChapters('previous');
    }
  }, [hasPrevious, isLoadingPrevious, loadMoreChapters]);

  const handleChapterVisible = useCallback((chapterNumber: number) => {
    setCurrentChapter(chapterNumber);
  }, [setCurrentChapter]);

  const selectChapter = useCallback(async (chapterNumber: number) => {
    const loadedChapter = await loadChapter(chapterNumber);
    if (!loadedChapter) return;
    window.requestAnimationFrame(() => {
      document.getElementById(`chapter-${chapterNumber}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [loadChapter]);

  const currentChapter = chapters.find(
    (ch) => ch.chapter_number === currentChapterNumber,
  );

  const readingProgress = chapterIndex.length
    ? Math.round((currentChapterNumber / chapterIndex.length) * 100)
    : 0;
  const currentIndex = chapterIndex.findIndex((chapter) => chapter.chapter_number === currentChapterNumber);
  const previousChapter = chapterIndex[currentIndex - 1];
  const nextChapter = chapterIndex[currentIndex + 1];

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${getBackgroundClass()}`}
      style={getCSSVars() as React.CSSProperties}
    >
      {/* Main Content Area */}
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
          <Link href={`/stories/${storyId}`} className="mb-8 inline-block text-sm text-gray-500 hover:text-black">Back to {storyTitle}</Link>
         

          {/* Reading Observer - Top */}
          {hasPrevious && <ReadingObserver edge="top" onIntersect={handleNearTop} />}
          {isLoadingPrevious && <ChapterLoader isLoading error={error} onRetry={handleNearTop} />}

          {chapters.map((chapter) => <ChapterContent key={chapter.id} chapter={chapter} onVisible={handleChapterVisible} />)}

          <ChapterLoader isLoading={isLoadingNext} error={error} onRetry={handleNearBottom} />

          {hasNext && <ReadingObserver edge="bottom" onIntersect={handleNearBottom} />}

          {(previousChapter || nextChapter) && (
            <div className="mt-12 flex justify-between border-t border-gray-200 pt-6">
              <button
                onClick={() => previousChapter && void selectChapter(previousChapter.chapter_number)}
                disabled={!previousChapter}
                className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Chapter {currentChapterNumber} of {chapterIndex.length}
                </p>
              </div>

              <button
                onClick={() => nextChapter && void selectChapter(nextChapter.chapter_number)}
                disabled={!nextChapter}
                className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right Margin - Sidebar */}
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

      {/* Reading Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Sidebar Panels */}
      <ChapterListPanel
        chapters={chapterIndex}
        currentChapterNumber={currentChapterNumber}
        onSelectChapter={(chapterNumber) => void selectChapter(chapterNumber)}
        isOpen={showChapters}
        onClose={() => setShowChapters(false)}
      />

      <ReaderSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={readingSettings}
        updateSettings={readingSettings.updateSettings}
        resetSettings={readingSettings.resetSettings}
      />

      <ChapterCommentsPanel
        chapterId={currentChapter?.id ?? null}
        chapterNumber={currentChapterNumber}
        chapterTitle={currentChapter?.title}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
}
