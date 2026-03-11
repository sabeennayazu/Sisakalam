'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Book, Settings, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import HeroSection from './HeroSection';
import ChapterContent from './ChapterContent';
import ChapterLoader from './ChapterLoader';
import ReadingObserver from './ReadingObserver';
import ChapterListPanel from '@/components/sidebar/ChapterListPanel';
import ReaderSettingsPanel from '@/components/sidebar/ReaderSettingsPanel';
import ChapterCommentsPanel from '@/components/sidebar/ChapterCommentsPanel';
import { ChapterData, useContinuousChapters } from '@/hooks/useContinuousChapters';
import { useReadingSettings } from '@/hooks/useReadingSettings';

interface ReadingLayoutProps {
  storyId: string;
  storyTitle: string;
  storyImage: string;
  storyAuthor: {
    id: string;
    name: string;
    profile_image: string;
  };
  synopsis: string;
  likes: number;
  views: number;
  bookmarks: number;
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
  initialChapters,
  initialChapterNumber,
}: ReadingLayoutProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Sidebar panels state
  const [showChapters, setShowChapters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Reading state
  const {
    chapters,
    currentChapterNumber,
    isLoading,
    error,
    addChapter,
    setCurrentChapter,
    prependChapter,
  } = useContinuousChapters(initialChapters, (chapterNumber) => {
    router.replace(
      `/reading/${storyId}/${chapterNumber}`,
      { scroll: false },
    );
  });

  const { backgroundColor, getCSSVars, getBackgroundClass } =
    useReadingSettings();

  const contentRef = useRef<HTMLDivElement>(null);
  const chapterRefsMap = useRef<Map<number, HTMLDivElement>>(new Map());

  // Hydrate on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle IntersectionObserver callbacks
  const handleNearBottom = useCallback(() => {
    const currentChapter = chapters.find(
      (ch) => ch.chapter_number === currentChapterNumber,
    );

    if (
      currentChapter &&
      currentChapter.next_chapter &&
      !isLoading
    ) {
      // Simulate fetching next chapter
      const nextChapterNumber = currentChapterNumber + 1;
      const mockNextChapter: ChapterData = {
        id: `ch-${nextChapterNumber}`,
        title: `Chapter ${nextChapterNumber} Title`,
        chapter_number: nextChapterNumber,
        content:
          'This is the content for chapter ' +
          nextChapterNumber +
          '. ' +
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(
            100,
          ),
        next_chapter: `${nextChapterNumber + 1}`,
        previous_chapter: `${nextChapterNumber - 1}`,
        created_at: new Date().toISOString(),
      };

      addChapter(mockNextChapter);
      setCurrentChapter(nextChapterNumber);
    }
  }, [chapters, currentChapterNumber, isLoading, addChapter, setCurrentChapter]);

  const handleNearTop = useCallback(() => {
    if (currentChapterNumber > 1 && !isLoading) {
      const prevChapterNumber = currentChapterNumber - 1;
      const prevChapterExists = chapters.some(
        (ch) => ch.chapter_number === prevChapterNumber,
      );

      if (!prevChapterExists) {
        const mockPrevChapter: ChapterData = {
          id: `ch-${prevChapterNumber}`,
          title: `Chapter ${prevChapterNumber} Title`,
          chapter_number: prevChapterNumber,
          content:
            'This is the content for chapter ' +
            prevChapterNumber +
            '. ' +
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'.repeat(
              100,
            ),
          next_chapter: `${prevChapterNumber + 1}`,
          previous_chapter: prevChapterNumber > 1 ? `${prevChapterNumber - 1}` : null,
          created_at: new Date().toISOString(),
        };

        prependChapter(mockPrevChapter);
      }
    }
  }, [currentChapterNumber, isLoading, chapters, prependChapter]);

  const currentChapter = chapters.find(
    (ch) => ch.chapter_number === currentChapterNumber,
  );

  // Get mock comments for current chapter
  const mockComments = [
    {
      id: '1',
      chapter_id: currentChapter?.id || '',
      user: 'Sarah Johnson',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      comment:
        'This chapter was amazing! The plot twist at the end caught me completely off guard.',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      likes: 24,
    },
    {
      id: '2',
      chapter_id: currentChapter?.id || '',
      user: 'Mike Chen',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      comment:
        'Cannot wait for the next chapter! The character development in this one was stellar.',
      created_at: new Date(Date.now() - 43200000).toISOString(),
      likes: 18,
    },
  ];

  // Calculate reading progress
  const readingProgress = currentChapter
    ? Math.round(
        ((currentChapter.chapter_number) /
          chapters[chapters.length - 1]?.chapter_number) *
          100,
      )
    : 0;

  if (!mounted) {
    return null;
  }

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
          {/* Hero Section - Only for Chapter 1 */}
          {currentChapterNumber === 1 && (
            <HeroSection
              title={storyTitle}
              synopsis={synopsis}
              author={storyAuthor}
              image={storyImage}
              likes={likes}
              views={views}
              bookmarks={bookmarks}
            />
          )}

          {/* Reading Observer - Top */}
          <ReadingObserver onNearTop={handleNearTop} onNearBottom={() => {}} />

          {/* Chapters Content */}
          <div>
            {currentChapter && (
              <ChapterContent
                key={currentChapter.id}
                chapter={currentChapter}
                ref={(node) => {
                  if (node)
                    chapterRefsMap.current.set(currentChapter.chapter_number, node);
                }}
              />
            )}
          </div>

          {/* Loading State */}
          <ChapterLoader isLoading={isLoading} error={error} />

          {/* Reading Observer - Bottom */}
          <ReadingObserver onNearTop={() => {}} onNearBottom={handleNearBottom} />

          {/* Navigation Buttons */}
          {currentChapter && (
            <div className="mt-12 flex justify-between border-t border-gray-200 pt-6">
              <button
                onClick={() => {
                  if (currentChapterNumber > 1) {
                    setCurrentChapter(currentChapterNumber - 1);
                  }
                }}
                disabled={currentChapterNumber === 1}
                className="flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>
                  Chapter {currentChapterNumber} of{' '}
                  {chapters[chapters.length - 1]?.chapter_number || '?'}
                </p>
              </div>

              <button
                onClick={() => {
                  const lastChapter = chapters[chapters.length - 1];
                  if (
                    lastChapter &&
                    currentChapterNumber < lastChapter.chapter_number
                  ) {
                    setCurrentChapter(currentChapterNumber + 1);
                  }
                }}
                disabled={
                  !chapters[chapters.length - 1] ||
                  currentChapterNumber >=
                    chapters[chapters.length - 1].chapter_number
                }
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
        chapters={chapters}
        currentChapterNumber={currentChapterNumber}
        onSelectChapter={setCurrentChapter}
        isOpen={showChapters}
        onClose={() => setShowChapters(false)}
      />

      <ReaderSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <ChapterCommentsPanel
        chapterId={currentChapter?.id || ''}
        chapterNumber={currentChapterNumber}
        comments={mockComments}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
}
