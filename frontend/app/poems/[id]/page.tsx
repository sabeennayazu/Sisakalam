"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/utils/account.api";
import { getMediaUrl } from "@/utils/api";
import { recordPoemView } from "@/utils/analytics.api";
import { getPoem } from "@/utils/poems.api";
import type { PoemApiRecord } from "@/types";
import ContentComments from "@/components/Comments/ContentComments";
import LikeButton from "@/components/interactions/LikeButton";
import BookmarkButton from "@/components/interactions/BookmarkButton";

interface PoemPageProps { params: Promise<{ id: string }> }

export default function PoemPage({ params }: PoemPageProps) {
  const [poem, setPoem] = useState<PoemApiRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const viewRecordedRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void params.then(async ({ id }) => {
      try {
        const [poemResponse, currentUser] = await Promise.all([
          getPoem<PoemApiRecord>(id),
          getCurrentUser().catch(() => null),
        ]);
        if (cancelled) return;

        const isOwner = Boolean(currentUser && currentUser.id === poemResponse.author);
        if (poemResponse.status !== "published" && !isOwner) {
          setNotFound(true);
          return;
        }

        setPoem(poemResponse);
        setCurrentUserId(currentUser?.id ?? null);
      } catch (loadError) {
        if (!cancelled) {
          if (loadError instanceof Error && "status" in loadError && (loadError as { status?: number }).status === 404) setNotFound(true);
          else setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [params]);

  useEffect(() => {
    if (!poem) return;
    if (viewRecordedRef.current === poem.id) return;
    if (currentUserId !== null && currentUserId === poem.author) {
      viewRecordedRef.current = poem.id;
      return;
    }

    viewRecordedRef.current = poem.id;
    void recordPoemView(poem.id).then((response) => {
      const responseData = response as { views_count?: number };
      if (typeof responseData.views_count === "number") {
        setPoem((current) => current ? { ...current, views: responseData.views_count ?? current.views } : current);
      }
    }).catch((viewError) => {
      console.warn("Unable to record poem view.", viewError);
    });
  }, [currentUserId, poem]);

  const wordCount = useMemo(() => poem?.content.trim().split(/\s+/).filter(Boolean).length ?? 0, [poem]);
  if (loading) return <StateMessage message="Loading poem..." />;
  if (notFound) return <StateMessage message="Poem not found." link="/poems" linkLabel="Back to Poems" />;
  if (error || !poem) return <StateMessage message="Unable to load this poem. Please try again." link="/poems" linkLabel="Back to Poems" />;

  return (
    <div className="min-h-screen bg-white">
      {poem.status !== "published" && currentUserId === poem.author && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
          This is a draft/private poem. Only you can view it right now.
        </div>
      )}
      <section className="bg-[#1a1a1a] py-22 text-white">
        <div className="relative z-10 mx-auto max-w-6xl px-8">
          <div className="flex flex-col gap-12 md:flex-row">
            <div className="flex shrink-0 justify-center md:justify-start">
              <div className="flex h-[400px] w-[260px] items-center justify-center overflow-hidden rounded-md bg-gray-800 shadow-2xl">
                {poem.image ? <img src={getMediaUrl(poem.image)} alt={poem.title} className="h-full w-full object-cover" /> : <span className="px-6 text-center text-gray-400">{poem.title}</span>}
              </div>
            </div>
            <div className="flex max-w-3xl flex-col justify-center">
              <div className="mb-4 flex flex-wrap gap-2">
                {poem.genre_name && <span className="rounded-full border border-gray-700 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-300">{poem.genre_name}</span>}
                {poem.is_mature && <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white">NSFW</span>}
              </div>
              <h1 className="mb-2 text-4xl font-serif font-bold tracking-tight md:text-6xl">{poem.title}</h1>
              <p className="mb-6 text-xl italic text-gray-400">by <Link href={`/profile/${encodeURIComponent(poem.author_name ?? "")}`} className="hover:text-white">{poem.author_name ?? "Unknown author"}</Link></p>
              <p className="mb-8 line-clamp-3 max-w-2xl text-base leading-relaxed text-gray-300">{poem.content}</p>
              <div className="mb-8 flex flex-wrap gap-8 md:gap-12">
                <Stat label="Views" value={poem.views} />
                <Stat label="Likes" value={poem.likes} />
                <Stat label="Words" value={wordCount} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100">Read Now</button>
                <BookmarkButton targetId={poem.id} targetType="poem" initialBookmarked={poem.is_bookmarked} showLabel className="rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/5" />
                <LikeButton targetId={poem.id} targetType="poem" initialLikes={poem.likes} initialLiked={poem.is_liked} showLabel className="rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/5 [&>span]:text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-8 py-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-gray-600">The Poem</p>
            {poem.content.split("\n\n").map((paragraph, index) => <p key={index} className="mb-6 whitespace-pre-wrap leading-8 text-gray-800">{paragraph}</p>)}
          </div>
          
        </div>
        <div className="mx-auto max-w-6xl px-8 pb-16"><ContentComments type="poem" contentId={poem.id} /></div>
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
