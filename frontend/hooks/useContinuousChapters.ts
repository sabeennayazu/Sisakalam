import { useState, useCallback, useEffect } from 'react';

export interface ChapterData {
  id: string;
  title: string;
  chapter_number: number;
  content: string;
  next_chapter?: string | null;
  previous_chapter?: string | null;
  created_at: string;
}

interface UseContinuousChaptersReturn {
  chapters: ChapterData[];
  currentChapterNumber: number;
  isLoading: boolean;
  error: string | null;
  loadMoreChapters: () => Promise<void>;
  addChapter: (chapter: ChapterData) => void;
  setCurrentChapter: (chapterNumber: number) => void;
  prependChapter: (chapter: ChapterData) => void;
}

/**
 * Custom hook for managing continuous chapter loading.
 * Keeps track of loaded chapters and handles pagination.
 */
export function useContinuousChapters(
  initialChapters: ChapterData[] = [],
  onChapterChange?: (chapterNumber: number) => void,
): UseContinuousChaptersReturn {
  const [chapters, setChapters] = useState<ChapterData[]>(initialChapters);
  const [currentChapterNumber, setCurrentChapterNumber] = useState(
    initialChapters[0]?.chapter_number ?? 1,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load next chapters
  const loadMoreChapters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (chapters.length === 0) return;

      const lastChapter = chapters[chapters.length - 1];
      if (!lastChapter.next_chapter) {
        setError('No more chapters available');
        return;
      }

      // TODO: Replace with actual API call
      // For now, this is a placeholder to be called by parent component
      // const response = await fetch(`/api/chapters/${lastChapter.next_chapter}`);
      // const data = await response.json();
      // setChapters(prev => [...prev, data]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load chapters',
      );
    } finally {
      setIsLoading(false);
    }
  }, [chapters]);

  const addChapter = useCallback((chapter: ChapterData) => {
    setChapters((prev) => [...prev, chapter]);
  }, []);

  const prependChapter = useCallback((chapter: ChapterData) => {
    setChapters((prev) => [chapter, ...prev]);
  }, []);

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
    loadMoreChapters,
    addChapter,
    setCurrentChapter: handleSetCurrentChapter,
    prependChapter,
  };
}
