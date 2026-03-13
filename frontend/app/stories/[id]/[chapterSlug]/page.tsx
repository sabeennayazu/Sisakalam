'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Book,
  Settings,
  MessageCircle,
  ThumbsUp,
  Gift,
} from 'lucide-react';

import {
  getStoryById,
  getChapterComments,
  getChaptersByStory,
} from '@/lib/mock-api';

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
  const [initialSlug, setInitialSlug] = useState<string | null>(null);

  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadedChapters, setLoadedChapters] = useState<Chapter[]>([]);

  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeComments, setActiveComments] = useState<Comment[]>([]);

  const [showChapters, setShowChapters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const { getBackgroundClass, getCSSVars } = useReadingSettings();

  const chapterRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const bottomSentinel = useRef<HTMLDivElement | null>(null);
  const topSentinel = useRef<HTMLDivElement | null>(null);
  const didInitialScrollRef = useRef(false);

  // ─────────────────────────────────────────
  // Resolve route params
  // ─────────────────────────────────────────

  useEffect(() => {
    params.then((resolved) => {
      setStoryId(parseInt(resolved.id));
      setInitialSlug(resolved.chapterSlug);
      setParamsResolved(true);
    });
  }, [params]);

  // ─────────────────────────────────────────
  // Load story + chapter list
  // ─────────────────────────────────────────

  useEffect(() => {

    if (!paramsResolved || storyId === null) return;

    const fetchedStory = getStoryById(storyId);
    if (!fetchedStory) return;

    setStory(fetchedStory);

    const allChapters = getChaptersByStory(storyId);
    setChapters(allChapters);

    const start = allChapters.find(c => c.slug === initialSlug) ?? allChapters[0];

    if (!start) return;

    setLoadedChapters([start]);
    setActiveChapter(start);
    setActiveComments(getChapterComments(start.id));

  }, [paramsResolved, storyId, initialSlug]);

  // ─────────────────────────────────────────
  // Lazy load NEXT chapter
  // ─────────────────────────────────────────

  useEffect(() => {

    if (!bottomSentinel.current) return;

    const observer = new IntersectionObserver(entries => {

      const entry = entries[0];

      if (!entry.isIntersecting) return;

      const lastLoaded = loadedChapters[loadedChapters.length - 1];
      if (!lastLoaded) return;

      const currentIndex = chapters.findIndex(c => c.id === lastLoaded.id);
      const next = chapters[currentIndex + 1];

      if (!next) return;

      setLoadedChapters(prev => {

        if (prev.find(c => c.id === next.id)) return prev;

        return [...prev, next];

      });

    }, { rootMargin: '600px' });

    observer.observe(bottomSentinel.current);

    return () => observer.disconnect();

  }, [loadedChapters, chapters]);

  // ─────────────────────────────────────────
  // Lazy load PREVIOUS chapter
  // ─────────────────────────────────────────

  useEffect(() => {

    if (!topSentinel.current) return;

    const observer = new IntersectionObserver(entries => {

      const entry = entries[0];

      if (!entry.isIntersecting) return;

      const firstLoaded = loadedChapters[0];
      if (!firstLoaded) return;

      const currentIndex = chapters.findIndex(c => c.id === firstLoaded.id);
      const previous = chapters[currentIndex - 1];

      if (!previous) return;

      setLoadedChapters(prev => {

        if (prev.find(c => c.id === previous.id)) return prev;

        return [previous, ...prev];

      });

    }, { rootMargin: '600px' });

    observer.observe(topSentinel.current);

    return () => observer.disconnect();

  }, [loadedChapters, chapters]);

  // ─────────────────────────────────────────
  // Track active chapter
  // ─────────────────────────────────────────

  useEffect(() => {
    if (loadedChapters.length === 0) return;

    const ratioMap: Record<string, number> = {};

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const slug = (entry.target as HTMLElement).dataset.slug;
        if (slug) ratioMap[slug] = entry.intersectionRatio;
      });

      // Find most visible chapter
      let bestSlug = '';
      let bestRatio = -1;
      for (const [slug, ratio] of Object.entries(ratioMap)) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestSlug = slug;
        }
      }

      if (bestSlug) {
        const best = loadedChapters.find(c => c.slug === bestSlug);
        if (best) {
          setActiveChapter(best);
          setActiveComments(getChapterComments(best.id));
          window.history.replaceState(null, '', `/stories/${storyId}/${best.slug}`);
        }
      }
    }, {
      rootMargin: '-20% 0px -20% 0px',
      // Using multiple thresholds ensures tall chapters still fire events
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
    });

    loadedChapters.forEach(ch => {
      const el = chapterRefs.current[ch.slug];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loadedChapters, storyId]);

  // ─────────────────────────────────────────
  // Sidebar chapter click & Initial Slug Jump
  // ─────────────────────────────────────────

  // Single reliable scroll function
  const scrollToChapter = useCallback((slug: string) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = chapterRefs.current[slug];
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
    });
  }, []);

  // Jump from URL parameter
  useEffect(() => {
    if (!initialSlug || loadedChapters.length === 0 || didInitialScrollRef.current) return;
    
    // Check if the target is actually rendered
    if (loadedChapters.some(c => c.slug === initialSlug)) {
      scrollToChapter(initialSlug);
      didInitialScrollRef.current = true;
    }
  }, [initialSlug, loadedChapters, scrollToChapter]);

  // Jump from sidebar panel
  const handleSelectChapter = useCallback((chapterNumber: number) => {
    const target = chapters.find(c => c.chapter_number === chapterNumber);
    if (!target) return;

    setLoadedChapters([target]);
    setShowChapters(false);

    // Give React time to render the new loadedChapters state
    setTimeout(() => {
      scrollToChapter(target.slug);
    }, 50);
  }, [chapters, scrollToChapter]);

  // ─────────────────────────────────────────
  // Mount guard
  // ─────────────────────────────────────────

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !paramsResolved) return null;

  if (!story || chapters.length === 0) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Chapter not found</h1>
          <p className="mt-2 text-gray-600">
            The chapter you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );

  }

  const totalChapters = chapters.length;

  const activeIndex = chapters.findIndex(
    c => c.slug === activeChapter?.slug
  );

  const progress =
    totalChapters > 0
      ? ((activeIndex + 1) / totalChapters) * 100
      : 0;

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${getBackgroundClass()}`}
      style={getCSSVars() as React.CSSProperties}
    >

      <div className="flex py-28 bg-white">

        <div className="hidden flex-1 md:block" />

        <div
          className="w-full max-w-2xl px-6 md:max-w-3xl md:px-8 border-x border-gray-300"
          style={{
            fontFamily: 'var(--reading-font-family)',
            fontSize: 'var(--reading-font-size)',
          }}
        >

          <div ref={topSentinel} />

          {loadedChapters.map((chapter, idx) => (

            <div
              key={chapter.slug}
              data-slug={chapter.slug}
              ref={(el) => {
                chapterRefs.current[chapter.slug] = el;
              }}
              className={idx > 0 ? 'mt-20' : ''}
            >

              <div className="mb-12">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-500">
                  Chapter {chapter.chapter_number} of {totalChapters}
                </p>

                <h2 className="mb-4 text-4xl font-bold text-gray-900">
                  {chapter.title}
                </h2>
              </div>

              <article className="prose prose-lg max-w-none text-gray-800">
                {chapter.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-6 leading-8">
                    {paragraph}
                  </p>
                ))}
              </article>

              <div className="mt-12 border-t border-gray-200 pt-8 pb-4">
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

            </div>

          ))}

          <div ref={bottomSentinel} />

        </div>

        <div className="hidden flex-1 md:flex md:justify-end">

          <div className="fixed right-0 top-1/2 -translate-y-1/2 space-y-3 pr-4">

            <button
              onClick={() => setShowChapters(!showChapters)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-lg hover:bg-blue-700 text-white"
            >
              <Book className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-600 shadow-lg hover:bg-gray-700 text-white"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 shadow-lg hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-5 w-5" />
            </button>

          </div>

        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ChapterListPanel
        chapters={chapters}
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