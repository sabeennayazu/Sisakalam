'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Book,
  Settings,
  MessageCircle,
  ThumbsUp,
  Gift,
} from 'lucide-react';
import { getStoryById, getChapterBySlug, getChapterComments, getChaptersByStory } from '@/lib/mock-api';
import type { Story } from '@/mock/stories';
import type { Chapter } from '@/mock/chapters';
import type { Comment } from '@/mock/comments';
import ChapterListPanel from '@/components/sidebar/ChapterListPanel';
import ReaderSettingsPanel from '@/components/sidebar/ReaderSettingsPanel';
import ChapterCommentsPanel from '@/components/sidebar/ChapterCommentsPanel';
import { useReadingSettings } from '@/hooks/useReadingSettings';

interface PageProps {
  params: Promise<{ id: string; chapterSlug: string }>;
}

export default function ChapterReadingPage({ params }: PageProps) {
  const [mounted, setMounted] = useState(false);
  const [paramsResolved, setParamsResolved] = useState(false);
  const [storyId, setStoryId] = useState<number | null>(null);

  const [story, setStory] = useState<Story | null>(null);
  // allChapters = every chapter for this story (sorted)
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  // loadedChapters = the subset rendered in the DOM (grows as user scrolls)
  const [loadedChapters, setLoadedChapters] = useState<Chapter[]>([]);
  // activeChapter = the chapter currently in view (drives URL + progress + comments)
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeComments, setActiveComments] = useState<Comment[]>([]);

  // Sidebar state
  const [showChapters, setShowChapters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { getBackgroundClass, getCSSVars } = useReadingSettings();

  // Track which chapter slugs are already loaded so we never double-append
  const loadedSlugsRef = useRef<Set<string>>(new Set());
  // Track which sentinels are already being observed
  const observedSentinelsRef = useRef<Set<string>>(new Set());
  // Store refs to sentinel elements keyed by chapter slug
  const sentinelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // Store refs to chapter header elements keyed by chapter slug (for active tracking)
  const chapterHeaderRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allChaptersRef = useRef<Chapter[]>([]);
  allChaptersRef.current = allChapters;

  // ─── Resolve params ─────────────────────────────────────────────────────────
  useEffect(() => {
    params.then((resolved) => {
      setStoryId(parseInt(resolved.id, 10));
      // Store initial slug so we can seed the first chapter
      sessionStorage.setItem('__initial_chapter_slug', resolved.chapterSlug);
      setParamsResolved(true);
    });
  }, [params]);

  // ─── Initial data load ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!paramsResolved || storyId === null) return;

    const fetchedStory = getStoryById(storyId);
    if (!fetchedStory) return;
    setStory(fetchedStory);

    const sorted = getChaptersByStory(storyId); // already sorted by chapter_number
    setAllChapters(sorted);

    const initialSlug = sessionStorage.getItem('__initial_chapter_slug') ?? sorted[0]?.slug;
    const startChapter = getChapterBySlug(storyId, initialSlug ?? '') ?? sorted[0];
    if (!startChapter) return;

    loadedSlugsRef.current.add(startChapter.slug);
    setLoadedChapters([startChapter]);
    setActiveChapter(startChapter);
    setActiveComments(getChapterComments(startChapter.id));
  }, [paramsResolved, storyId]);

  // ─── Append next chapter ─────────────────────────────────────────────────────
  const appendNextChapter = useCallback((afterSlug: string) => {
    const chapters = allChaptersRef.current;
    const current = chapters.find((c) => c.slug === afterSlug);
    if (!current?.next_chapter) return;
    const nextSlug = current.next_chapter;
    if (loadedSlugsRef.current.has(nextSlug)) return;

    const nextChapter = chapters.find((c) => c.slug === nextSlug);
    if (!nextChapter) return;

    loadedSlugsRef.current.add(nextSlug);
    setLoadedChapters((prev) => [...prev, nextChapter]);
  }, []);

  // ─── Observe each sentinel (bottom of each chapter) ─────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const slug = (entry.target as HTMLElement).dataset.slug;
            if (slug) appendNextChapter(slug);
          }
        });
      },
      { rootMargin: '400px', threshold: 0 },
    );

    // Observe any sentinel that hasn't been observed yet
    loadedChapters.forEach((chapter) => {
      const el = sentinelRefs.current[chapter.slug];
      if (el && !observedSentinelsRef.current.has(chapter.slug)) {
        observer.observe(el);
        observedSentinelsRef.current.add(chapter.slug);
      }
    });

    return () => observer.disconnect();
  }, [loadedChapters, appendNextChapter]);

  // ─── Track active chapter (updates URL + progress + comments panel) ─────────
  useEffect(() => {
    if (loadedChapters.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The chapter whose header is most visible wins
        let best: { ratio: number; chapter: Chapter } | null = null;
        entries.forEach((entry) => {
          const slug = (entry.target as HTMLElement).dataset.slug;
          const chapter = loadedChapters.find((c) => c.slug === slug);
          if (!chapter) return;
          if (!best || entry.intersectionRatio > best.ratio) {
            best = { ratio: entry.intersectionRatio, chapter };
          }
        });
        if (best && (best as { ratio: number; chapter: Chapter }).ratio > 0) {
          const ch = (best as { ratio: number; chapter: Chapter }).chapter;
          setActiveChapter(ch);
          setActiveComments(getChapterComments(ch.id));
          // Update URL without navigation
          window.history.replaceState(null, '', `/stories/${storyId}/${ch.slug}`);
        }
      },
      { threshold: [0, 0.1, 0.3, 0.5] },
    );

    loadedChapters.forEach((chapter) => {
      const el = chapterHeaderRefs.current[chapter.slug];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loadedChapters, storyId]);

  // ─── Scroll-to chapter (from chapter list panel) ─────────────────────────────
  const handleSelectChapter = useCallback(
    (chapterNumber: number) => {
      const target = allChapters.find((c) => c.chapter_number === chapterNumber);
      if (!target) return;

      // If the chapter isn't loaded yet, load everything up to it first
      if (!loadedSlugsRef.current.has(target.slug)) {
        const toLoad = allChapters.filter(
          (c) => c.chapter_number <= chapterNumber && !loadedSlugsRef.current.has(c.slug),
        );
        toLoad.forEach((c) => loadedSlugsRef.current.add(c.slug));
        setLoadedChapters((prev) => [...prev, ...toLoad]);
      }

      // Scroll after a tick to let the DOM update
      setTimeout(() => {
        const el = document.getElementById(`chapter-${chapterNumber}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);

      setShowChapters(false);
    },
    [allChapters],
  );

  // ─── Mounting guard ───────────────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !paramsResolved) return null;

  if (!story || loadedChapters.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Chapter not found</h1>
          <p className="mt-2 text-gray-600">The chapter you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const totalChapters = allChapters.length;
  const activeIndex = allChapters.findIndex((c) => c.slug === activeChapter?.slug);
  const progress = totalChapters > 0 ? ((activeIndex + 1) / totalChapters) * 100 : 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${getBackgroundClass()}`}
      style={getCSSVars() as React.CSSProperties}
    >
      {/* ── Main scrollable reading area ── */}
      <div className="flex py-14 bg-white">
        {/* Left gutter */}
        <div className="hidden flex-1 md:block" />

        {/* Reading column */}
        <div
          className="w-full max-w-2xl px-6 md:max-w-3xl md:px-8 border-x border-gray-300"
          style={{
            fontFamily: 'var(--reading-font-family)',
            fontSize: 'var(--reading-font-size)',
          }}
        >
          {loadedChapters.map((chapter, chapterIdx) => {
            const isLast = chapter.slug === loadedChapters[loadedChapters.length - 1].slug;
            const hasMore = !!chapter.next_chapter;

            return (
              <div key={chapter.slug} id={`chapter-${chapter.chapter_number}`}>
                {/* ── Chapter Header ── */}
                <div
                  ref={(el) => { chapterHeaderRefs.current[chapter.slug] = el; }}
                  data-slug={chapter.slug}
                  className={`${chapterIdx > 0 ? 'mt-20 pt-12 border-t-2 border-gray-200' : ''} mb-12`}
                >
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
                    Chapter {chapter.chapter_number} of {totalChapters}
                  </p>
                  <h1 className="mb-4 text-4xl font-bold text-gray-900">
                    {chapter.title}
                  </h1>
                  <p className="text-sm text-gray-400">
                    {new Date(chapter.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* ── Chapter Content ── */}
                <article className="prose prose-lg max-w-none text-gray-800">
                  {chapter.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6 leading-8">
                      {paragraph}
                    </p>
                  ))}
                </article>

                {/* ── Chapter Actions (comment / vote / gift) ── */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <div className="flex justify-center gap-8">
                    <button
                      onClick={() => {
                        setActiveChapter(chapter);
                        setActiveComments(getChapterComments(chapter.id));
                        setShowComments(true);
                      }}
                      className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-sm font-semibold">COMMENT</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <ThumbsUp className="h-6 w-6" />
                      <span className="text-sm font-semibold">VOTE</span>
                    </button>

                    <button className="flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <Gift className="h-6 w-6" />
                      <span className="text-sm font-semibold">SEND GIFT</span>
                    </button>
                  </div>
                </div>

                {/* ── Sentinel that triggers loading the next chapter ── */}
                {isLast && hasMore && (
                  <div
                    ref={(el) => { sentinelRefs.current[chapter.slug] = el; }}
                    data-slug={chapter.slug}
                    className="h-1 w-full"
                    aria-hidden="true"
                  />
                )}

                {/* ── End-of-story indicator ── */}
                {isLast && !hasMore && (
                  <div className="mt-16 mb-8 flex flex-col items-center gap-3 text-gray-400">
                    <div className="h-px w-24 bg-gray-300" />
                    <p className="text-sm font-medium tracking-wide">End of Story</p>
                    <div className="h-px w-24 bg-gray-300" />
                  </div>
                )}

                {/* ── Loading indicator (only after the last loaded chapter, if more exist) ── */}
                {isLast && hasMore && loadedSlugsRef.current.has(chapter.next_chapter ?? '') === false && (
                  <div className="mt-8 flex justify-center pb-8">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                      <span className="text-sm">Loading next chapter…</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right sidebar — floating action buttons */}
        <div className="hidden flex-1 md:flex md:justify-end">
          <div className="fixed right-0 top-1/2 -translate-y-1/2 space-y-3 pr-4">
            <button
              onClick={() => setShowChapters(!showChapters)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-transform hover:scale-110 hover:bg-blue-700 text-white"
              title="Chapters"
            >
              <Book className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 shadow-lg transition-transform hover:scale-110 hover:bg-gray-700 text-white"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                setShowComments(!showComments);
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 shadow-lg transition-transform hover:scale-110 hover:bg-green-700 text-white"
              title="Comments"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Sidebar panels ── */}
      <ChapterListPanel
        chapters={allChapters.map((c) => ({
          id: c.id,
          title: c.title,
          chapter_number: c.chapter_number,
          content: c.content,
          next_chapter: c.next_chapter,
          previous_chapter: c.previous_chapter,
          created_at: c.created_at,
        }))}
        currentChapterNumber={activeChapter?.chapter_number ?? 1}
        onSelectChapter={handleSelectChapter}
        isOpen={showChapters}
        onClose={() => setShowChapters(false)}
      />

      <ReaderSettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <ChapterCommentsPanel
        chapterId={activeChapter?.id ?? ''}
        chapterNumber={activeChapter?.chapter_number ?? 1}
        comments={activeComments}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
}
