import { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';

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
  isLoadingPrevious: boolean;
  isLoadingNext: boolean;
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
  const [chapters, setChapters] = useState<ChapterData[]>(() => [...initialChapters].sort((left, right) => left.chapter_number - right.chapter_number));
  const [currentChapterNumber, setCurrentChapterNumber] = useState(initialChapterNumber);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(new Map<number, Promise<ChapterData | null>>());
  const loadingPreviousRef = useRef(false);
  const loadingNextRef = useRef(false);
  const previousTasksRef = useRef(0);
  const nextTasksRef = useRef(0);
  const chaptersRef = useRef(chapters);
  useLayoutEffect(() => {
    chaptersRef.current = chapters;
  }, [chapters]);

  const sortChapters = useCallback((items: ChapterData[]) => [...items].sort((left, right) => left.chapter_number - right.chapter_number), []);

  const loadReference = useCallback((reference: ChapterReference): Promise<ChapterData | null> => {
    const loadedChapter = chaptersRef.current.find((chapter) => chapter.id === reference.id);
    if (loadedChapter) return Promise.resolve(loadedChapter);
    const inFlight = inFlightRef.current.get(reference.id);
    if (inFlight) return inFlight;

    setError(null);
    const request = fetchChapter(reference.slug)
      .then((chapter) => {
      setChapters((current) => {
        if (current.some((item) => item.id === chapter.id)) {
          return sortChapters(current);
        }
        return sortChapters([...current, chapter]);
      });
      return chapter;
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load chapters.');
        return null;
      })
      .finally(() => inFlightRef.current.delete(reference.id));
    inFlightRef.current.set(reference.id, request);
    return request;
  }, [fetchChapter, sortChapters]);

  const changeDirectionalTaskCount = useCallback((direction: ChapterDirection, amount: number) => {
    const taskRef = direction === 'next' ? nextTasksRef : previousTasksRef;
    const setLoading = direction === 'next' ? setIsLoadingNext : setIsLoadingPrevious;
    taskRef.current = Math.max(0, taskRef.current + amount);
    setLoading(taskRef.current > 0);
  }, []);

  const ensureWindowAroundCurrent = useCallback(async (chapterNumber: number) => {
    if (!chapterIndex.length) return;
    const currentIndex = chapterIndex.findIndex((chapter) => chapter.chapter_number === chapterNumber);
    if (currentIndex < 0) return;
    const start = Math.max(0, currentIndex - 5);
    const end = Math.min(chapterIndex.length, currentIndex + 6);
    const references = chapterIndex.slice(start, end).filter((reference) =>
      !chaptersRef.current.some((chapter) => chapter.id === reference.id),
    );
    const previous = references.filter((reference) => reference.chapter_number < chapterNumber);
    const next = references.filter((reference) => reference.chapter_number > chapterNumber);
    if (previous.length) changeDirectionalTaskCount('previous', 1);
    if (next.length) changeDirectionalTaskCount('next', 1);
    await Promise.all(references.map((reference) => loadReference(reference)));
    if (previous.length) changeDirectionalTaskCount('previous', -1);
    if (next.length) changeDirectionalTaskCount('next', -1);
  }, [chapterIndex, changeDirectionalTaskCount, loadReference]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) void ensureWindowAroundCurrent(initialChapterNumber);
    });
    return () => { active = false; };
  }, [ensureWindowAroundCurrent, initialChapterNumber]);

  useEffect(() => {
    const initialIds = new Set(initialChapters.map((chapter) => chapter.id));
    if (!initialIds.size) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      setChapters((current) => sortChapters([
        ...current.filter((chapter) => !initialIds.has(chapter.id)),
        ...initialChapters,
      ]));
      setCurrentChapterNumber(initialChapterNumber);
      setError(null);
    });
    return () => { active = false; };
  }, [initialChapterNumber, initialChapters, sortChapters]);

  const loadChapter = useCallback(async (chapterNumber: number) => {
    const loadedChapter = chapters.find((chapter) => chapter.chapter_number === chapterNumber);
    if (loadedChapter) return loadedChapter;
    const reference = chapterIndex.find((chapter) => chapter.chapter_number === chapterNumber);
    return reference ? loadReference(reference) : null;
  }, [chapterIndex, chapters, loadReference]);

  const loadMoreChapters = useCallback(async (direction: ChapterDirection) => {
    if (chapterIndex.length === 0 || chapters.length === 0) return;
    const loadedIndexes = chapters
      .map((chapter) => chapterIndex.findIndex((reference) => reference.id === chapter.id))
      .filter((index) => index >= 0);
    if (!loadedIndexes.length) return;

    const edge = direction === 'next' ? Math.max(...loadedIndexes) : Math.min(...loadedIndexes);
    const targets = direction === 'next'
      ? chapterIndex.slice(edge + 1, edge + 6)
      : chapterIndex.slice(Math.max(0, edge - 5), edge).reverse();
    if (!targets.length) return;

    const loadingRef = direction === 'next' ? loadingNextRef : loadingPreviousRef;
    if (loadingRef.current) return;
    loadingRef.current = true;
    changeDirectionalTaskCount(direction, 1);
    await Promise.all(targets.map((reference) => loadReference(reference)));
    loadingRef.current = false;
    changeDirectionalTaskCount(direction, -1);
  }, [chapterIndex, chapters, changeDirectionalTaskCount, loadReference]);

  const handleSetCurrentChapter = useCallback(
    (chapterNumber: number) => {
      setCurrentChapterNumber(chapterNumber);
      void ensureWindowAroundCurrent(chapterNumber);
      onChapterChange?.(chapterNumber);
    },
    [ensureWindowAroundCurrent, onChapterChange],
  );

  const loadedIndexes = chapters
    .map((chapter) => chapterIndex.findIndex((reference) => reference.id === chapter.id))
    .filter((index) => index >= 0);
  const firstLoadedIndex = loadedIndexes.length ? Math.min(...loadedIndexes) : -1;
  const lastLoadedIndex = loadedIndexes.length ? Math.max(...loadedIndexes) : -1;

  return {
    chapters,
    currentChapterNumber,
    isLoadingPrevious,
    isLoadingNext,
    error,
    hasPrevious: firstLoadedIndex > 0,
    hasNext: lastLoadedIndex >= 0 && lastLoadedIndex < chapterIndex.length - 1,
    loadMoreChapters,
    loadChapter,
    setCurrentChapter: handleSetCurrentChapter,
  };
}
