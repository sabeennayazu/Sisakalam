"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoaderCircle, Search } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";
import UserAvatar from "@/components/shared/UserAvatar";
import { searchContent, type SearchResponse, type SearchUserResult } from "@/utils/search.api";

type Category = "all" | "stories" | "poems" | "users";
type SortMode = "relevance" | "recent" | "popular" | "liked";

interface SearchState {
  query: string;
  response?: SearchResponse;
  error?: string;
}

function SearchDiscovery() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const [category, setCategory] = useState<Category>("all");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("relevance");
  const [includeSafe, setIncludeSafe] = useState(true);
  const [includeMature, setIncludeMature] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      void searchContent(query, { page: 1, limit: 12, signal: controller.signal })
        .then((response) => setSearchState({ query, response }))
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setSearchState({ query, error: error instanceof Error ? error.message : "Search is unavailable right now." });
          }
        });
    }, 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, retryKey]);

  const currentState = searchState?.query === query ? searchState : null;
  const response = currentState?.response;
  const loading = Boolean(query && !currentState);
  const allWorks = useMemo(() => [...(response?.stories ?? []), ...(response?.poems ?? [])], [response]);
  const genres = useMemo(() => [...new Set(allWorks.map((work) => work.genre).filter(Boolean))].sort(), [allWorks]);

  const works = useMemo(() => {
    const selected = category === "stories"
      ? allWorks.filter((item) => item.type === "story")
      : category === "poems"
        ? allWorks.filter((item) => item.type === "poem")
        : allWorks;
    return selected
      .filter((item) => selectedGenres.length === 0 || selectedGenres.includes(item.genre))
      .filter((item) => (includeSafe && !item.is_mature) || (includeMature && item.is_mature))
      .sort((first, second) => {
        if (sortMode === "popular") return second.views - first.views;
        if (sortMode === "liked") return second.likes - first.likes;
        if (sortMode === "recent") return Date.parse(second.created_at) - Date.parse(first.created_at);
        return 0;
      });
  }, [allWorks, category, includeMature, includeSafe, selectedGenres, sortMode]);

  const users = response?.users ?? [];
  const visibleUsers = category === "all" || category === "users" ? users : [];
  const totalForCategory = response ? category === "stories" ? response.counts.stories
    : category === "poems" ? response.counts.poems
      : category === "users" ? response.counts.users
        : response.total : 0;
  const hasMore = response && (category === "stories" ? response.has_more.stories
    : category === "poems" ? response.has_more.poems
      : category === "users" ? response.has_more.users
        : Object.values(response.has_more).some(Boolean));

  const toggleGenre = (genre: string) => {
    setSelectedGenres((current) => current.includes(genre)
      ? current.filter((item) => item !== genre)
      : [...current, genre]);
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSortMode("relevance");
    setIncludeSafe(true);
    setIncludeMature(true);
  };

  const loadMore = async () => {
    if (!response || loadingMore || !Object.values(response.has_more).some(Boolean)) return;
    setLoadingMore(true);
    try {
      const nextPage = response.page + 1;
      const next = await searchContent(query, { page: nextPage, limit: response.limit });
      setSearchState((current) => current?.query === query && current.response
        ? {
          query,
          response: {
            ...next,
            stories: [...current.response.stories, ...next.stories],
            poems: [...current.response.poems, ...next.poems],
            users: [...current.response.users, ...next.users],
          },
        }
        : current);
    } catch {
      setSearchState((current) => current?.query === query && current.response
        ? { ...current, error: "More results could not be loaded. Please try again." }
        : current);
    } finally {
      setLoadingMore(false);
    }
  };

  const categoryTabs: { id: Category; label: string; count: number }[] = [
    { id: "all", label: "All", count: response?.total ?? 0 },
    { id: "stories", label: "Stories", count: response?.counts.stories ?? 0 },
    { id: "poems", label: "Poems", count: response?.counts.poems ?? 0 },
    { id: "users", label: "Users", count: response?.counts.users ?? 0 },
  ];

  return (
    <main className="min-h-screen bg-[#f8f8f8] px-4 pb-10 pt-24 text-black sm:px-6">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-5">
        <section className="rounded-xl bg-white px-5 py-5 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:px-8">
          <h1 className="font-serif text-[27px] leading-tight text-[#171717] sm:text-[30px]">Search Sisakalam</h1>
          <form action="/search" method="GET" className="mx-auto mt-4 flex h-11 max-w-[590px] items-center gap-3 rounded-full border border-black/10 bg-[#fafafa] px-3 focus-within:border-black/25">
            <Search size={17} className="ml-1 shrink-0 text-black/45" aria-hidden="true" />
            <input name="q" defaultValue={query} placeholder="Search stories, poems, and writers" aria-label="Search stories, poems, and writers" className="h-full min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-black/40" />
            <button type="submit" className="rounded-full bg-black px-5 py-2 text-[10px] font-semibold uppercase text-white transition hover:bg-black/75">Search</button>
          </form>
        </section>

        <div className="grid gap-5 lg:grid-cols-[198px_minmax(0,1fr)]">
          <aside className="hidden h-fit rounded-xl border border-black/10 bg-white p-4 lg:block">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <h2 className="text-[11px] font-semibold uppercase">Filters</h2>
              <button type="button" onClick={resetFilters} className="text-[10px] text-black/55 underline underline-offset-2 hover:text-black">Reset all</button>
            </div>
            <fieldset className="border-b border-black/[0.06] py-3">
              <legend className="mb-2 text-[10px] font-medium uppercase text-black/45">Genres</legend>
              {genres.length ? <div className="space-y-1.5">{genres.map((genre) => <label key={genre} className="flex cursor-pointer items-center gap-2 text-xs text-black/75"><input type="checkbox" checked={selectedGenres.includes(genre)} onChange={() => toggleGenre(genre)} className="h-3.5 w-3.5 accent-black" />{genre}</label>)}</div> : <p className="text-xs text-black/40">No genres in these results.</p>}
            </fieldset>
            <fieldset className="border-b border-black/[0.06] py-3">
              <legend className="mb-2 text-[10px] font-medium uppercase text-black/45">Sort by</legend>
              <div className="space-y-1.5">{([['relevance', 'Relevance'], ['recent', 'Most Recent'], ['popular', 'Most Popular'], ['liked', 'Most Liked']] as const).map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-2 text-xs text-black/75"><input type="radio" name="sort" checked={sortMode === value} onChange={() => setSortMode(value)} className="h-3.5 w-3.5 accent-black" />{label}</label>)}</div>
            </fieldset>
            <fieldset className="pt-3">
              <legend className="mb-2 text-[10px] font-medium uppercase text-black/45">Rating</legend>
              <div className="space-y-1.5"><label className="flex cursor-pointer items-center gap-2 text-xs text-black/75"><input type="checkbox" checked={includeSafe} onChange={(event) => setIncludeSafe(event.target.checked)} className="h-3.5 w-3.5 accent-black" />Safe for Work</label><label className="flex cursor-pointer items-center gap-2 text-xs text-black/75"><input type="checkbox" checked={includeMature} onChange={(event) => setIncludeMature(event.target.checked)} className="h-3.5 w-3.5 accent-black" />NSFW Included</label></div>
            </fieldset>
          </aside>

          <section className="min-w-0">
            <nav className="mb-4 flex gap-1 overflow-x-auto border-b border-black/10" aria-label="Search result categories">
              {categoryTabs.map((tab) => <button key={tab.id} type="button" onClick={() => setCategory(tab.id)} aria-pressed={category === tab.id} className={`shrink-0 border-b-2 px-4 py-2.5 text-[10px] font-semibold uppercase ${category === tab.id ? "border-black text-black" : "border-transparent text-black/50 hover:text-black"}`}>{tab.label}<span className="ml-1.5 text-black/45">{tab.count}</span></button>)}
            </nav>

            <div className="mb-4 flex items-baseline gap-2">
              <h2 className="font-serif text-sm font-semibold">{query ? `Results for “${query}”` : "Search results"}</h2>
              {response && <span className="text-[10px] text-black/45">{totalForCategory} items</span>}
            </div>

            {loading ? <div className="flex min-h-64 items-center justify-center gap-2 text-xs text-black/45" role="status"><LoaderCircle size={15} className="animate-spin" /> Searching</div>
              : currentState?.error && !response ? <div className="flex min-h-64 flex-col items-center justify-center text-center"><p className="text-sm text-black/65">{currentState.error}</p><button type="button" onClick={() => setRetryKey((value) => value + 1)} className="mt-3 text-xs font-medium underline">Try again</button></div>
                : !query ? <div className="flex min-h-64 items-center justify-center text-center text-sm text-black/45">Enter a query to search public stories, poems, and users.</div>
                  : currentState?.error ? <p className="mb-3 text-xs text-black/55" role="status">{currentState.error}</p>
                    : !response || (works.length === 0 && visibleUsers.length === 0) ? <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white"><Search size={19} className="text-black/40" /></div><h3 className="text-sm font-semibold">No results found</h3><p className="mt-1 max-w-xs text-xs leading-5 text-black/50">Try a different spelling or search phrase.</p></div>
                      : <>
                        {works.length > 0 && <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-items-center gap-x-5 gap-y-5 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
                          {works.map((item) => <UniversalCard key={`${item.type}-${item.id}`} id={item.id} title={item.title} author={item.author} authorId={item.author_id} authorImage={item.author_profile_picture} genre={item.genre} image={item.image ?? ""} views={item.views} likes={item.likes} comments={item.comments} type={item.type} description={item.description} isMature={item.is_mature} tags={item.tags} />)}
                        </div>}
                        {visibleUsers.length > 0 && <section className="mt-8" aria-label="Users">
                          <h3 className="mb-3 border-b border-black/10 pb-2 text-[10px] font-semibold uppercase">Users</h3>
                          <div className="divide-y divide-black/[0.07] bg-white">
                            {visibleUsers.map((user) => <UserResult key={user.id} user={user} />)}
                          </div>
                        </section>}
                        {hasMore && <div className="flex justify-center py-7"><button type="button" onClick={() => void loadMore()} disabled={loadingMore} className="inline-flex items-center gap-2 border border-black/15 px-4 py-2 text-[10px] font-semibold uppercase hover:bg-white disabled:opacity-50">{loadingMore && <LoaderCircle size={13} className="animate-spin" />}Load more results</button></div>}
                      </>}
          </section>
        </div>
      </div>
    </main>
  );
}

function UserResult({ user }: { user: SearchUserResult }) {
  return <Link href={`/profile/${encodeURIComponent(user.username)}`} className="flex items-center gap-3 px-4 py-3 hover:bg-black/[0.025]">
    <UserAvatar userId={user.id} username={user.username} imageUrl={user.profile_picture} className="h-10 w-10 border border-black/10" fallbackClassName="bg-black/[0.04] text-black/60 text-sm" />
    <span className="min-w-0"><span className="block truncate text-sm font-medium">{user.username}</span><span className="block truncate text-xs text-black/45">@{user.username}</span></span>
  </Link>;
}

export default function SearchPage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f8f8f8] pt-24" />}><SearchDiscovery /></Suspense>;
}