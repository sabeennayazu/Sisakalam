"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReadingLayout from "@/components/reading/ReadingLayout";
import { ChapterData, ChapterReference } from "@/hooks/useContinuousChapters";
import { getCurrentUser } from "@/utils/account.api";
import { getMediaUrl } from "@/utils/api";
import { getStory, getStoryChapterBySlug, getStoryChapters } from "@/utils/stories.api";
import type { ChapterApiRecord, ChapterReferenceApiRecord, StoryApiRecord } from "@/types";

interface PageProps { params: Promise<{ id: string; chapterSlug: string }> }

interface ReaderData {
  story: StoryApiRecord;
  chapterIndex: ChapterReference[];
  initialChapters: ChapterData[];
  initialChapterNumber: number;
}

export default function ChapterReadingPage({ params }: PageProps) {
  const [readerData, setReaderData] = useState<ReaderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const readerDataRef = useRef<ReaderData | null>(readerData);
  const internalRouteKeyRef = useRef<string | null>(null);
  readerDataRef.current = readerData;
  const { id, chapterSlug } = use(params);

  useEffect(() => {
    const markReaderRouteSync = (event: Event) => {
      const detail = (event as CustomEvent<{ storyId: string; chapterSlug: string }>).detail;
      internalRouteKeyRef.current = `${detail.storyId}:${detail.chapterSlug}`;
    };
    window.addEventListener("sisakalam:reader-route-sync", markReaderRouteSync);
    return () => window.removeEventListener("sisakalam:reader-route-sync", markReaderRouteSync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const routeKey = `${id}:${chapterSlug}`;
    const isReaderRouteSync = internalRouteKeyRef.current === routeKey;
    internalRouteKeyRef.current = null;
    if (isReaderRouteSync) return () => { cancelled = true; };

    const existingReader = readerDataRef.current;
    const sameStory = existingReader && String(existingReader.story.id) === id;

    setNotFound(false);
    setError(false);
    if (sameStory) {
      const referenceExists = existingReader.chapterIndex.some((chapter) => chapter.slug === chapterSlug);
      if (!referenceExists) {
        setNotFound(true);
        return () => { cancelled = true; };
      }
      setLoading(false);
      void getStoryChapterBySlug<ChapterApiRecord>(id, chapterSlug).then((selectedChapter) => {
        if (cancelled) return;
        setReaderData((current) => current && String(current.story.id) === id
          ? { ...current, initialChapters: [toChapterData(selectedChapter)], initialChapterNumber: selectedChapter.chapter_number }
          : current);
      }).catch((loadError: unknown) => {
        if (cancelled) return;
        if (loadError instanceof Error && "status" in loadError && (loadError as { status?: number }).status === 404) setNotFound(true);
        else setError(true);
      });
      return () => { cancelled = true; };
    }

    setReaderData(null);
    setLoading(true);
    void (async () => {
      try {
        const [story, chapterReferences, currentUser] = await Promise.all([
          getStory<StoryApiRecord>(id),
          getStoryChapters<ChapterReferenceApiRecord[]>(id, { metadata: true }),
          getCurrentUser().catch(() => null),
        ]);
        const isOwner = Boolean(currentUser && currentUser.id === story.author);
        if (story.status !== "published" && !isOwner) { setNotFound(true); return; }

        const rawChapterReferences = (chapterReferences ?? []) as unknown;
        const chapterList = Array.isArray(rawChapterReferences)
          ? rawChapterReferences as ChapterReferenceApiRecord[]
          : ((rawChapterReferences as { chapters?: ChapterReferenceApiRecord[] })?.chapters ?? []);
        const chapterIndex: ChapterReference[] = chapterList.map(({ id: chapterId, slug, title, chapter_number, created_at }) => ({
          id: chapterId,
          slug,
          title,
          chapter_number,
          created_at,
        }));
        const selectedIndex = chapterIndex.findIndex((chapter) => chapter.slug === chapterSlug);
        if (selectedIndex < 0) { setNotFound(true); return; }

        const selectedChapter = await getStoryChapterBySlug<ChapterApiRecord>(id, chapterSlug);
        if (cancelled) return;
        setReaderData({ story, chapterIndex, initialChapters: [toChapterData(selectedChapter)], initialChapterNumber: selectedChapter.chapter_number });
      } catch (loadError) {
        if (cancelled) return;
        if (loadError instanceof Error && "status" in loadError && (loadError as { status?: number }).status === 404) setNotFound(true);
        else setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id, chapterSlug]);

  if (loading) return <StateMessage message="Loading chapter..." />;
  if (error) return <StateMessage message="Unable to load this chapter. Please try again." link={readerData ? `/stories/${readerData.story.id}` : "/stories"} linkLabel="Back to Story" />;
  if (notFound || !readerData) return <StateMessage message="Chapter not found." link={readerData ? `/stories/${readerData.story.id}` : "/stories"} linkLabel="Back to Story" />;

  const { story } = readerData;
  return <ReadingLayout
    storyId={String(story.id)}
    storyTitle={story.title}
    storyImage={getMediaUrl(story.image)}
    storyAuthor={{ id: String(story.author), name: story.author_name ?? "Unknown author" }}
    synopsis={story.synopsis}
    likes={story.likes}
    views={story.views}
    bookmarks={story.favorites_count}
    chapterIndex={readerData.chapterIndex}
    initialChapters={readerData.initialChapters}
    initialChapterNumber={readerData.initialChapterNumber}
  />;
}

function toChapterData(chapter: ChapterApiRecord): ChapterData {
  return {
    id: chapter.id,
    slug: chapter.slug,
    title: chapter.title,
    chapter_number: chapter.chapter_number,
    content: chapter.content,
    created_at: chapter.created_at,
  };
}

function StateMessage({ message, link, linkLabel }: { message: string; link?: string; linkLabel?: string }) {
  return <div className="flex min-h-screen items-center justify-center bg-white"><div className="text-center"><p className="text-gray-600">{message}</p>{link && <Link href={link} className="mt-4 inline-block rounded bg-black px-6 py-2 text-white">{linkLabel}</Link>}</div></div>;
}
