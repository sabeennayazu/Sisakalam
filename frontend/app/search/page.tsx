"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Search,
  RotateCcw,
} from "lucide-react";

import UniversalCard from "@/components/shared/UniversalCard";

type ContentType = "story" | "poem";
interface SearchResult {
  id: number;
  type: ContentType;
  title: string;
  author: string;
  authorId: number;
  genre: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
  description: string;
  isMature?: boolean;
}

const results: SearchResult[] = [
  {
    id: 1,
    type: "story",
    title: "Echoes of Dawn",
    author: "Rupesh",
    authorId: 1,
    genre: "Epic",
    image: "/images/covers/cover1.jpg",
    views: 243,
    likes: 124,
    comments: 18,
    description: "A forgotten kingdom wakes beneath the first light of dawn.",
  },
  {
    id: 2,
    type: "story",
    title: "Silent Forest",
    author: "Maya",
    authorId: 2,
    genre: "Novel",
    image: "/images/covers/cover2.jpg",
    views: 187,
    likes: 89,
    comments: 12,
    description: "A quiet trail leads to a secret the village buried long ago.",
  },
  {
    id: 3,
    type: "poem",
    title: "Urban Dreams",
    author: "Sabin",
    authorId: 3,
    genre: "Poetry",
    image: "/images/covers/cover3.jpg",
    views: 982,
    likes: 213,
    comments: 27,
    description: "Small hopes drift through the noise of a sleepless city.",
  },
  {
    id: 4,
    type: "poem",
    title: "Midnight Rain",
    author: "Palpasa",
    authorId: 4,
    genre: "Ballad",
    image: "/images/covers/cover4.jpg",
    views: 321,
    likes: 67,
    comments: 8,
    description: "Rain keeps time against the glass while the old house sleeps.",
  },
  {
    id: 5,
    type: "story",
    title: "The Last Rain",
    author: "Ok",
    authorId: 5,
    genre: "Novel",
    image: "/images/covers/cover5.jpg",
    views: 761,
    likes: 104,
    comments: 22,
    description: "Memories, distance, and the things we never say.",
  },
  {
    id: 6,
    type: "poem",
    title: "Letters I Never Sent",
    author: "Bikash",
    authorId: 6,
    genre: "Cinquain",
    image: "/images/covers/cover6.jpg",
    views: 512,
    likes: 213,
    comments: 27,
    description: "Words that stayed inside long after the person had left.",
  },
  {
    id: 7,
    type: "story",
    title: "The Forgotten Road",
    author: "Chandra",
    authorId: 7,
    genre: "Epic",
    image: "/images/covers/cover7.jpg",
    views: 679,
    likes: 89,
    comments: 12,
    description: "Sometimes the road we forget is the one that leads us home.",
  },
  {
    id: 8,
    type: "poem",
    title: "Rain on the Window",
    author: "Maya",
    authorId: 2,
    genre: "Ballad",
    image: "/images/covers/cover8.jpg",
    views: 304,
    likes: 67,
    comments: 8,
    description: "A quiet evening, rain on the glass, and an old memory.",
  },
  {
    id: 9,
    type: "story",
    title: "A Map of Stars",
    author: "Sita",
    authorId: 9,
    genre: "Epic",
    image: "/images/covers/cover9.jpg",
    views: 864,
    likes: 176,
    comments: 31,
    description: "Two travelers follow a constellation beyond the known world.",
  },
  {
    id: 10,
    type: "poem",
    title: "Small Things, Kept",
    author: "Rohan",
    authorId: 10,
    genre: "Cinquain",
    image: "/images/covers/cover10.jpg",
    views: 199,
    likes: 42,
    comments: 5,
    description: "A pocket-sized collection of ordinary wonders.",
  },
  {
    id: 11,
    type: "story",
    title: "Haribahadur",
    author: "Palpasa",
    authorId: 4,
    genre: "Ballad",
    image: "/images/covers/cover11.jpg",
    views: 108,
    likes: 19,
    comments: 3,
    description: "A wandering voice finds its way through the hills.",
    isMature: true,
  },
  {
    id: 12,
    type: "poem",
    title: "Blue Hour",
    author: "Nima",
    authorId: 12,
    genre: "Poetry",
    image: "/images/covers/cover12.jpg",
    views: 429,
    likes: 92,
    comments: 14,
    description: "The last blue light settles over the rooftops.",
  },
];

const genres = ["Epic", "Cinquain", "Poetry", "Ballad", "Novel"];
const trending = ["Epic", "Cinquain", "Ballad", "Novel", "Classic Poetry"];
type SortMode = "recent" | "popular" | "liked";

function SearchDiscovery() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("recent");
  const [includeSafe, setIncludeSafe] = useState(true);
  const [includeMature, setIncludeMature] = useState(true);
  const normalizedQuery = query.toLocaleLowerCase();
  const filteredResults = results
    .filter((result) => {
      const matchesQuery = !normalizedQuery || [result.title, result.author, result.genre, result.description]
        .some((value) => value.toLocaleLowerCase().includes(normalizedQuery)) ||
        (normalizedQuery === "classic poetry" && result.type === "poem");
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(result.genre);
      const matchesRating = (includeSafe && !result.isMature) || (includeMature && result.isMature);
      return matchesQuery && matchesGenre && matchesRating;
    })
    .sort((first, second) => {
      if (sortMode === "popular") return second.views - first.views;
      if (sortMode === "liked") return second.likes - first.likes;
      return second.id - first.id;
    });

  const toggleGenre = (genre: string) => {
    setSelectedGenres((current) => current.includes(genre)
      ? current.filter((item) => item !== genre)
      : [...current, genre]);
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSortMode("recent");
    setIncludeSafe(true);
    setIncludeMature(true);
  };

  return (
    <main className="h-dvh overflow-hidden bg-[#f8f8f8] px-4 pb-4 pt-24 text-black sm:px-6">
      <div className="mx-auto flex h-full max-w-[1440px] flex-col gap-5">
        <section className="shrink-0 rounded-xl  bg-white px-5 py-5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:px-8">
          <h1 className="font-serif text-[27px] leading-tight text-[#171717] sm:text-[30px]">Discover Verse &amp; Narrative</h1>
          <form action="/search" method="GET" className="mx-auto mt-4 flex h-11 max-w-[590px] items-center gap-3 rounded-full border border-black/8 bg-[#fafafa] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus-within:border-black/20">
            <Search size={17} className="ml-1 shrink-0 text-slate-400" aria-hidden="true" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search poems, stories, authors, or genres..."
              aria-label="Search poems, stories, authors, or genres"
              className="h-full min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
            />
            <button type="submit" className="rounded-full bg-black px-5 py-2 text-[10px] font-semibold uppercase text-white transition hover:bg-black/75">Search</button>
          </form>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <span className="mr-1">Trending:</span>
            {trending.map((item) => (
              <Link key={item} href={`/search?q=${encodeURIComponent(item)}`} className="rounded-full bg-[#f2f3f5] px-3 py-1 text-slate-600 transition hover:bg-black hover:text-white">{item}</Link>
            ))}
          </div>
        </section>

        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[198px_minmax(0,1fr)]">
          <aside className="hidden h-fit rounded-xl border border-black/8 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] lg:block">
            <div className="flex items-center justify-between border-b border-black/6 pb-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide">Filters</h2>
              <button type="button" onClick={resetFilters} className="text-[10px] text-slate-500 underline underline-offset-2 hover:text-black">Reset all</button>
            </div>
            <fieldset className="border-b border-black/6 py-3">
              <legend className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">Genres</legend>
              <div className="space-y-1.5">
                {genres.map((genre) => (
                  <label key={genre} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                    <input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => toggleGenre(genre)} className="h-3.5 w-3.5 accent-black" />
                    {genre}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="border-b border-black/6 py-3">
              <legend className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">Sort by</legend>
              <div className="space-y-1.5">
                {([['recent', 'Most Recent'], ['popular', 'Most Popular'], ['liked', 'Most Liked']] as const).map(([value, label]) => (
                  <label key={value} className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
                    <input type="radio" name="sort" value={value} checked={sortMode === value} onChange={() => setSortMode(value)} className="h-3.5 w-3.5 accent-black" />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="pt-3">
              <legend className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">Rating</legend>
              <div className="space-y-1.5">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={includeSafe} onChange={(event) => setIncludeSafe(event.target.checked)} className="h-3.5 w-3.5 accent-black" />Safe for Work</label>
                <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={includeMature} onChange={(event) => setIncludeMature(event.target.checked)} className="h-3.5 w-3.5 accent-black" />NSFW Included</label>
              </div>
            </fieldset>
          </aside>

          <section className="flex min-h-0 flex-col">
            <details className="mb-3 shrink-0 rounded-xl border border-black/8 bg-white px-3 py-2 lg:hidden">
              <summary className="cursor-pointer list-none text-xs font-semibold">Filters</summary>
              <div className="mt-3 grid gap-4 border-t border-black/6 pt-3 sm:grid-cols-3">
                <fieldset>
                  <legend className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">Genres</legend>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {genres.map((genre) => (
                      <label key={genre} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => toggleGenre(genre)} className="h-3.5 w-3.5 accent-black" />{genre}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">Sort by</legend>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {([['recent', 'Most Recent'], ['popular', 'Most Popular'], ['liked', 'Most Liked']] as const).map(([value, label]) => (
                      <label key={value} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <input type="radio" name="mobile-sort" checked={sortMode === value} onChange={() => setSortMode(value)} className="h-3.5 w-3.5 accent-black" />{label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-2 text-[10px] font-medium uppercase tracking-wide text-slate-400">Rating</legend>
                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700"><input type="checkbox" checked={includeSafe} onChange={(event) => setIncludeSafe(event.target.checked)} className="h-3.5 w-3.5 accent-black" />Safe for Work</label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700"><input type="checkbox" checked={includeMature} onChange={(event) => setIncludeMature(event.target.checked)} className="h-3.5 w-3.5 accent-black" />NSFW Included</label>
                  </div>
                </fieldset>
                <button type="button" onClick={resetFilters} className="inline-flex items-center gap-1.5 text-xs text-slate-500 underline underline-offset-2 hover:text-black sm:col-span-3"><RotateCcw size={12} />Reset all</button>
              </div>
            </details>
            <div className="mb-4 flex shrink-0 items-baseline gap-1.5">
              <h2 className="font-serif text-sm font-semibold">{query ? `Results for “${query}”` : "Discovery Results"}</h2>
              <span className="text-[10px] text-slate-400">({filteredResults.length} items)</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
              {filteredResults.length > 0 ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-items-center gap-x-5 gap-y-5 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                  {filteredResults.map((result) => (
                    <UniversalCard
                      key={`${result.type}-${result.id}`}
                      id={result.id}
                      title={result.title}
                      author={result.author}
                      authorId={result.authorId}
                      genre={result.genre}
                      image={result.image}
                      views={result.views}
                      likes={result.likes}
                      comments={result.comments}
                      type={result.type}
                      description={result.description}
                      isMature={result.isMature}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white"><Search size={19} className="text-slate-400" /></div>
                  <h3 className="text-sm font-semibold">No matching works</h3>
                  <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Try another phrase or reset the filters to see more poetry and stories.</p>
                  <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-black"><RotateCcw size={13} />Reset filters</button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="h-dvh bg-[#f8f8f8]" />}>
      <SearchDiscovery />
    </Suspense>
  );
}
