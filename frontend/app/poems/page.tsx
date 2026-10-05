"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import UniversalCard from "@/components/shared/UniversalCard";
import { fetchGenres, getMediaUrl } from "@/utils/api";
import { getPoems } from "@/utils/poems.api";
import type { PaginatedResponse, PoemApiRecord } from "@/types";

const PAGE_SIZE = 20;
const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "most_liked", label: "Most Liked" },
  { value: "most_commented", label: "Most Commented" },
  { value: "newest", label: "Newest" },
  { value: "recently_updated", label: "Recently Updated" },
  { value: "highest_rated", label: "Highest Rated" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export default function PoemsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [poems, setPoems] = useState<PoemApiRecord[]>([]);
  const [genres, setGenres] = useState<Array<{ id: number; name: string; type: "story" | "poem" }>>([]);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") ?? "all");
  const [sort, setSort] = useState<SortValue>((searchParams.get("sort") as SortValue) || "popular");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);
  const isMountedRef = useRef(true);

  const loadPoems = useCallback(async (pageToLoad: number, reset = false) => {
    const loadingMore = pageToLoad > 1;
    if (loadingMore) {
      if (isLoadingMoreRef.current) return;
      isLoadingMoreRef.current = true;
      setIsLoadingMore(true);
      setLoadMoreError(false);
    } else {
      setIsLoading(true);
      setError(false);
    }

    try {
      const response = await getPoems<PaginatedResponse<PoemApiRecord>>({
        page: pageToLoad,
        page_size: PAGE_SIZE,
        genre: selectedGenre && selectedGenre !== "all" ? selectedGenre : undefined,
        sort,
      });
      if (!isMountedRef.current) return;
      const publishedPoems = (response.results ?? []).filter((poem) => poem.status === "published");
      setPoems((current) => (reset ? publishedPoems : [...current, ...publishedPoems]));
      setPage(pageToLoad);
      setHasMore(Boolean(response.next));
    } catch (loadError) {
      console.error("Unable to load poems", loadError);
      if (loadingMore) setLoadMoreError(true);
      else setError(true);
    } finally {
      if (loadingMore) {
        isLoadingMoreRef.current = false;
        if (isMountedRef.current) setIsLoadingMore(false);
      } else if (isMountedRef.current) setIsLoading(false);
    }
  }, [selectedGenre, sort]);

  useEffect(() => {
    void fetchGenres("poem")
      .then((items) => {
         if (isMountedRef.current) setGenres(items);
      })
      .catch(() => setGenres([]));

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const currentQueryString = searchParams.toString();
    const params = new URLSearchParams(currentQueryString);
    if (selectedGenre === "all") params.delete("genre");
    else params.set("genre", selectedGenre);
    params.set("sort", sort);
    const nextQueryString = params.toString();
    const nextUrl = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;
    if (nextQueryString !== currentQueryString) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [pathname, router, searchParams, selectedGenre, sort]);

  useEffect(() => {
    void loadPoems(1, true);
  }, [loadPoems]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) void loadPoems(page + 1, false);
  }, [hasMore, isLoadingMore, loadPoems, page]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || isLoadingMore || isLoading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        handleLoadMore();
      }
    }, { rootMargin: "240px" });

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, handleLoadMore]);

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 xl:px-8">
          <h1 className="mb-3 text-4xl font-serif font-bold text-gray-900">Poems</h1>
          <p className="text-lg text-gray-600">Explore beautiful verses and poetic expressions</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 xl:px-8">
        <div className="mb-8 flex flex-col gap-3 border-b border-gray-200 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>Genre</span>
              <select
                value={selectedGenre}
                onChange={(event) => setSelectedGenre(event.target.value)}
                className="min-w-[180px] rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                <option value="all">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>{genre.name}</option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <span>Sort By</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortValue)}
                className="min-w-[190px] rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {isLoading && <p className="py-16 text-center text-sm text-gray-500">Loading poems...</p>}

        {!isLoading && error && (
          <div className="py-16 text-center text-sm text-red-600">
            <p>Unable to load poems.</p>
            <button type="button" onClick={() => void loadPoems(1, true)} className="mt-2 underline">Please try again.</button>
          </div>
        )}

        {!isLoading && !error && poems.length === 0 && (
          <div className="py-20 text-center text-sm text-gray-500">No poems match the selected filter yet.</div>
        )}

        {!isLoading && !error && poems.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] justify-items-center gap-5 md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
            {poems.map((poem) => (
              <UniversalCard
                key={poem.id}
                id={poem.id}
                title={poem.title}
                author={poem.author_name ?? "Unknown author"}
                authorId={poem.author}
                authorImage={poem.author_profile_picture}
                genre={poem.genre_name ?? ""}
                image={getMediaUrl(poem.image)}
                views={poem.views}
                likes={poem.likes}
                comments={poem.comments_count}
                type="poem"
                isMature={poem.is_mature}
                status={poem.status}
                isPrivate={poem.is_private}
                description={poem.content}
                tags={poem.tag_names}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && poems.length > 0 && hasMore && (
          <div className="flex flex-col items-center gap-2 pt-12">
            {loadMoreError && <p className="text-sm text-red-600">Unable to load more poems.</p>}
            <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="rounded-full border border-gray-200 px-6 py-3 text-sm text-gray-700 transition hover:border-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoadingMore ? "Loading..." : "See More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
