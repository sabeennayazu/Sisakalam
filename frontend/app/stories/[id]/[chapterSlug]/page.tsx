"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link"; // This line is retained for context
import ReadingLayout from "@/components/reading/ReadingLayout";
import { ChapterData, ChapterReference } from "@/hooks/useContinuousChapters";
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
  const loadedStoryId = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void params.then(async ({ id, chapterSlug }) => {
      if (loadedStoryId.current === id) return;
      loadedStoryId.current = id;
      try {
        const [story, chapterReferences] = await Promise.all([
          getStory<StoryApiRecord>(id),
          getStoryChapters<ChapterReferenceApiRecord[]>(id, true),
        ]);
        if (cancelled) return;
        if (story.status !== "published") { setNotFound(true); return; }
        const chapterIndex: ChapterReference[] = chapterReferences.map(({ id: chapterId, slug, title, chapter_number, created_at }) => ({
          id: chapterId,
          slug,
          title,
          chapter_number,
          created_at,
        }));
        const selectedIndex = chapterIndex.findIndex((chapter) => chapter.slug === chapterSlug);
        if (selectedIndex < 0) { setNotFound(true); return; }

        const selectedChapter = await getStoryChapterBySlug<ChapterApiRecord>(id, chapterSlug);
        const firstIndex = Math.max(0, selectedIndex - 1);
        const lastIndex = Math.min(chapterIndex.length, selectedIndex + 2);
        const initialReferences = chapterIndex.slice(firstIndex, lastIndex);
        const initialChapters = await Promise.all(initialReferences.map(async (reference) => {
          const chapter = reference.slug === selectedChapter.slug
            ? selectedChapter
            : await getStoryChapterBySlug<ChapterApiRecord>(id, reference.slug);
          return toChapterData(chapter);
        }));
        if (cancelled) return;
        setReaderData({ story, chapterIndex, initialChapters, initialChapterNumber: selectedChapter.chapter_number });
      } catch (loadError) {
        if (cancelled) return;
        if (loadError instanceof Error && "status" in loadError && (loadError as { status?: number }).status === 404) setNotFound(true);
        else setError(true);
        loadedStoryId.current = null;
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [params]);

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
