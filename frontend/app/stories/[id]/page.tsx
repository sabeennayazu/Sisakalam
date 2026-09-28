"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/utils/account.api";
import { getMediaUrl } from "@/utils/api";
import { getStory, getStoryChapters } from "@/utils/stories.api";
import type { ChapterApiRecord, StoryApiRecord } from "@/types";
import ContentComments from "@/components/Comments/ContentComments";

interface StoryPageProps { params: Promise<{ id: string }> }

export default function StoryPage({ params }: StoryPageProps) {
  const [story, setStory] = useState<StoryApiRecord | null>(null);
  const [chapters, setChapters] = useState<ChapterApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void params.then(async ({ id }) => {
      try {
        const [storyResponse, chapterResponse] = await Promise.all([
          getStory<StoryApiRecord>(id),
          getStoryChapters<ChapterApiRecord[]>(id),
        ]);
        if (cancelled) return;
        if (storyResponse.status !== "published") { setNotFound(true); return; }
        setStory(storyResponse);
        setChapters(chapterResponse);
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

  useEffect(() => {
    getCurrentUser().then((user) => setCurrentUserId(user.id)).catch(() => setCurrentUserId(null));
  }, []);

  if (loading) return <StateMessage message="Loading story..." />;
  if (notFound) return <StateMessage message="Story not found." link="/stories" linkLabel="Back to Stories" />;
  if (error || !story) return <StateMessage message="Unable to load this story. Please try again." link="/stories" linkLabel="Back to Stories" />;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#1a1a1a] py-24 text-white">
        <div className="relative z-10 mx-auto max-w-6xl px-8">
          <div className="flex flex-col gap-12 md:flex-row">
            <div className="flex shrink-0 justify-center md:justify-start">
              <div className="flex h-[400px] w-[260px] items-center justify-center overflow-hidden rounded-md bg-gray-800 shadow-2xl">
                {story.image ? <img src={getMediaUrl(story.image)} alt={story.title} className="h-full w-full object-cover" /> : <span className="px-6 text-center text-gray-400">{story.title}</span>}
              </div>
            </div>
            <div className="flex max-w-3xl flex-col justify-center">
              <div className="mb-4 flex flex-wrap gap-2">
                {story.genre_name && <span className="rounded-full border border-gray-700 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-300">{story.genre_name}</span>}
                {story.is_mature && <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold">NSFW</span>}
              </div>
              <h1 className="mb-2 text-4xl font-serif font-bold tracking-tight md:text-6xl">{story.title}</h1>
              <p className="mb-6 text-xl italic text-gray-400">by <Link href={`/profile/${encodeURIComponent(story.author_name ?? "")}`} onClick={(event) => event.stopPropagation()} className="hover:text-white">{story.author_name ?? "Unknown author"}</Link></p>
              <p className="mb-8 line-clamp-3 max-w-2xl leading-relaxed text-gray-300">{story.synopsis}</p>
              <div className="mb-8 flex flex-wrap gap-8 md:gap-12"><Stat label="Views" value={story.views} /><Stat label="Likes" value={story.likes} /><Stat label="Chapters" value={chapters.length} /></div>
              <div className="flex flex-wrap items-center gap-4">
                {chapters[0] && <Link href={`/stories/${story.id}/${chapters[0].slug}`} className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100">Read Now</Link>}
                {currentUserId === story.author && <Link href={`/write?storyId=${story.id}&mode=chapter`} className="rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5">Add Chapter</Link>}
                <button className="rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5">Add to Bookmark</button>
                <button className="rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5">Like</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-8 py-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="lg:col-span-2"><h2 className="mb-8 text-3xl font-bold text-gray-900">Chapters ({chapters.length})</h2>{chapters.length === 0 ? <p className="text-gray-500">No chapters have been published yet.</p> : <div className="grid gap-3 sm:grid-cols-2">{chapters.map((chapter) => <Link key={chapter.id} href={`/stories/${story.id}/${chapter.slug}`} className="group rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-600 hover:bg-blue-50"><h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Chapter {chapter.chapter_number}</h3><p className="line-clamp-1 text-sm text-gray-600">{chapter.title}</p><p className="mt-2 text-xs text-gray-500">{new Date(chapter.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p></Link>)}</div>}<div className="mt-10"><ContentComments type="story" contentId={story.id} /></div></div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div><p className="text-lg font-bold">{value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value}</p><p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p></div>;
}

function StateMessage({ message, link, linkLabel }: { message: string; link?: string; linkLabel?: string }) {
  return <div className="flex min-h-screen items-center justify-center bg-white"><div className="text-center"><p className="text-gray-600">{message}</p>{link && <Link href={link} className="mt-4 inline-block rounded bg-black px-6 py-2 text-white">{linkLabel}</Link>}</div></div>;
}
