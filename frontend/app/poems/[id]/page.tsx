"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getMediaUrl } from "@/utils/api";
import { getPoem } from "@/utils/poems.api";
import PoemStats from "@/components/Poems/PoemStats";
import Tags from "@/components/Poems/Tags";
import type { PoemApiRecord } from "@/types";

interface PoemPageProps { params: Promise<{ id: string }> }

export default function PoemPage({ params }: PoemPageProps) {
  const [poem, setPoem] = useState<PoemApiRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void params.then(({ id }) => getPoem<PoemApiRecord>(id).then((response) => {
      if (!cancelled) response.status === "published" ? setPoem(response) : setNotFound(true);
    }).catch((loadError) => {
      if (!cancelled) {
        if (loadError instanceof Error && "status" in loadError && (loadError as { status?: number }).status === 404) setNotFound(true);
        else setError(true);
      }
    }).finally(() => { if (!cancelled) setLoading(false); }));
    return () => { cancelled = true; };
  }, [params]);

  const wordCount = useMemo(() => poem?.content.trim().split(/\s+/).filter(Boolean).length ?? 0, [poem]);
  if (loading) return <StateMessage message="Loading poem..." />;
  if (notFound) return <StateMessage message="Poem not found." link="/poems" linkLabel="Back to Poems" />;
  if (error || !poem) return <StateMessage message="Unable to load this poem. Please try again." link="/poems" linkLabel="Back to Poems" />;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#1a1a1a] py-16 text-white">
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
              <p className="mb-6 text-xl italic text-gray-400">by {poem.author_name ?? "Unknown author"}</p>
              <p className="mb-8 line-clamp-3 max-w-2xl text-base leading-relaxed text-gray-300">{poem.content}</p>
              <div className="mb-8 flex flex-wrap gap-8 md:gap-12">
                <Stat label="Views" value={poem.views} />
                <Stat label="Likes" value={poem.likes} />
                <Stat label="Words" value={wordCount} />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-gray-100">Read Now</button>
                <button className="rounded-full border border-gray-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5">Add to Library</button>
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
          <div className="space-y-6">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-600">Stats & Rating</p>
              <PoemStats rating={4.92} reviewCount={892} publicationDate={new Date(poem.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} wordCount={wordCount} readingTime={Math.ceil(wordCount / 200)} />
            </div>
            <Tags tags={poem.tag_names} />
            <button className="w-full rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">REPORT CONTENT</button>
          </div>
        </div>
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
