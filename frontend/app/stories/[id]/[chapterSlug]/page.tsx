"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStory, getStoryChapterBySlug, getStoryChapters } from "@/utils/stories.api";
import type { ChapterApiRecord, StoryApiRecord } from "@/types";
import ContentComments from "@/components/Comments/ContentComments";

interface PageProps { params: Promise<{ id: string; chapterSlug: string }> }

export default function ChapterReadingPage({ params }: PageProps) {
  const [story, setStory] = useState<StoryApiRecord | null>(null);
  const [chapter, setChapter] = useState<ChapterApiRecord | null>(null);
  const [chapters, setChapters] = useState<ChapterApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void params.then(async ({ id, chapterSlug }) => {
      try {
        const [storyResponse, chapterResponse, chaptersResponse] = await Promise.all([
          getStory<StoryApiRecord>(id),
          getStoryChapterBySlug<ChapterApiRecord>(id, chapterSlug),
          getStoryChapters<ChapterApiRecord[]>(id),
        ]);
        if (cancelled) return;
        if (storyResponse.status !== "published") { setNotFound(true); return; }
        setStory(storyResponse);
        setChapter(chapterResponse);
        setChapters(chaptersResponse);
      } catch (loadError) {
        if (cancelled) return;
        if (loadError instanceof Error && "status" in loadError && (loadError as { status?: number }).status === 404) setNotFound(true);
        else setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [params]);

  if (loading) return <StateMessage message="Loading chapter..." />;
  if (error) return <StateMessage message="Unable to load this chapter. Please try again." link={story ? `/stories/${story.id}` : "/stories"} linkLabel="Back to Story" />;
  if (notFound || !story || !chapter) return <StateMessage message="Chapter not found." link={story ? `/stories/${story.id}` : "/stories"} linkLabel="Back to Story" />;

  const currentIndex = chapters.findIndex((item) => item.id === chapter.id);
  const previous = chapters[currentIndex - 1];
  const next = chapters[currentIndex + 1];

  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
          <Link href={`/stories/${story.id}`} className="text-sm text-gray-500 hover:text-black">Back to {story.title}</Link>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">Chapter {chapter.chapter_number} of {chapters.length}</span>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">{story.title}</p>
        <h1 className="mb-12 text-4xl font-bold text-gray-900 md:text-5xl">{chapter.title}</h1>
        <div className="prose prose-lg max-w-none text-gray-800">{chapter.content.split("\n\n").map((paragraph, index) => <p key={index} className="mb-6 whitespace-pre-wrap leading-8">{paragraph}</p>)}</div>
        <nav className="mt-16 flex justify-between gap-4 border-t border-gray-200 pt-8">
          {previous ? <Link href={`/stories/${story.id}/${previous.slug}`} className="text-sm font-semibold text-gray-700 hover:text-black">Previous chapter</Link> : <span />}
          {next ? <Link href={`/stories/${story.id}/${next.slug}`} className="text-sm font-semibold text-gray-700 hover:text-black">Next chapter</Link> : <Link href={`/stories/${story.id}`} className="text-sm font-semibold text-gray-700 hover:text-black">Back to story</Link>}
        </nav>
      </article>
      <aside className="mx-auto grid max-w-3xl gap-6 px-6 pb-16 md:px-10"><div className="border border-gray-200 bg-white p-5 shadow-sm"><h2 className="text-lg font-semibold text-black">Reviews</h2><p className="mt-2 text-sm text-gray-500">Reviews are not available yet.</p></div><ContentComments type="story" contentId={story.id} /></aside>
    </main>
  );
}

function StateMessage({ message, link, linkLabel }: { message: string; link?: string; linkLabel?: string }) {
  return <div className="flex min-h-screen items-center justify-center bg-white"><div className="text-center"><p className="text-gray-600">{message}</p>{link && <Link href={link} className="mt-4 inline-block rounded bg-black px-6 py-2 text-white">{linkLabel}</Link>}</div></div>;
}
