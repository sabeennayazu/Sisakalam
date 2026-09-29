import { useState, useCallback, useRef } from 'react';

export interface ChapterData {
  id: number;
  slug: string;
  title: string;
  chapter_number: number;
  content: string;
  created_at: string;
}

export interface ChapterReference {
  id: number;
  slug: string;
  title: string;
  chapter_number: number;
  created_at: string;
}

export type ChapterDirection = 'next' | 'previous';

interface UseContinuousChaptersReturn {
  chapters: ChapterData[];
  currentChapterNumber: number;
  isLoading: boolean;
  error: string | null;
  hasPrevious: boolean;
  hasNext: boolean;
  loadMoreChapters: (direction: ChapterDirection) => Promise<void>;
  loadChapter: (chapterNumber: number) => Promise<ChapterData | null>;
  setCurrentChapter: (chapterNumber: number) => void;
}

/**
 * Custom hook for managing continuous chapter loading.
 * Keeps track of loaded chapters and handles pagination.
 */
export function useContinuousChapters(
  initialChapters: ChapterData[],
  chapterIndex: ChapterReference[],
  initialChapterNumber: number,
  fetchChapter: (slug: string) => Promise<ChapterData>,
  onChapterChange?: (chapterNumber: number) => void,
): UseContinuousChaptersReturn {
  const [chapters, setChapters] = useState<ChapterData[]>(initialChapters);
  const [currentChapterNumber, setCurrentChapterNumber] = useState(initialChapterNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const loadChapter = useCallback(async (chapterNumber: number) => {
    const loadedChapter = chapters.find((chapter) => chapter.chapter_number === chapterNumber);
    if (loadedChapter) return loadedChapter;
    const reference = chapterIndex.find((chapter) => chapter.chapter_number === chapterNumber);
    if (!reference || loadingRef.current) return null;
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);
    try {
      const chapter = await fetchChapter(reference.slug);
      setChapters((current) => {
        if (current.some((item) => item.id === chapter.id)) return current;
        return [...current, chapter].sort((left, right) => left.chapter_number - right.chapter_number);
      });
      return chapter;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapters.');
      return null;
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [chapterIndex, chapters, fetchChapter]);

  const loadMoreChapters = useCallback(async (direction: ChapterDirection) => {
    if (chapters.length === 0) return;
    const loadedNumbers = chapters.map((chapter) => chapter.chapter_number);
    const boundary = direction === 'next' ? Math.max(...loadedNumbers) : Math.min(...loadedNumbers);
    const reference = direction === 'next'
      ? chapterIndex.find((chapter) => chapter.chapter_number > boundary)
      : [...chapterIndex].reverse().find((chapter) => chapter.chapter_number < boundary);
    if (reference) await loadChapter(reference.chapter_number);
  }, [chapterIndex, chapters, loadChapter]);

  const handleSetCurrentChapter = useCallback(
    (chapterNumber: number) => {
      setCurrentChapterNumber(chapterNumber);
      onChapterChange?.(chapterNumber);
    },
    [onChapterChange],
  );

  return {
    chapters,
    currentChapterNumber,
    isLoading,
    error,
    hasPrevious: chapters.length > 0 && chapterIndex.some((chapter) => chapter.chapter_number < Math.min(...chapters.map((item) => item.chapter_number))),
    hasNext: chapters.length > 0 && chapterIndex.some((chapter) => chapter.chapter_number > Math.max(...chapters.map((item) => item.chapter_number))),
    loadMoreChapters,
    loadChapter,
    setCurrentChapter: handleSetCurrentChapter,
  };
}
