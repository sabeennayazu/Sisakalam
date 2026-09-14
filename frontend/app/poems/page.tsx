"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import UniversalCard from "@/components/shared/UniversalCard";
import { getMediaUrl } from "@/utils/api";
import { getPoems } from "@/utils/poems.api";
import type { PaginatedResponse, PoemApiRecord } from "@/types";

const PAGE_SIZE = 15;

export default function PoemsPage() {
  const [poems, setPoems] = useState<PoemApiRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const isMountedRef = useRef(true);

  const loadPoems = useCallback(async (pageToLoad: number) => {
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
      });
      if (!isMountedRef.current) return;
      const publishedPoems = response.results.filter((poem) => poem.status === "published");
      setPoems((current) => pageToLoad === 1 ? publishedPoems : [...current, ...publishedPoems]);
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
  }, []);

  useEffect(() => {
    void loadPoems(1);
    return () => {
      isMountedRef.current = false;
    };
  }, [loadPoems]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) void loadPoems(page + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Poems
          </h1>
          <p className="text-lg text-gray-600">
            Explore beautiful verses and poetic expressions
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {isLoading && <p className="py-16 text-center text-sm text-gray-500">Loading poems...</p>}
        {!isLoading && error && (
          <div className="py-16 text-center text-sm text-red-600">
            <p>Unable to load poems.</p>
            <button type="button" onClick={() => void loadPoems(1)} className="mt-2 underline">Please try again.</button>
          </div>
        )}
        {!isLoading && !error && poems.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-500">No poems have been published yet.</p>
        )}
        {!isLoading && !error && poems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {poems.map((poem) => (
              <UniversalCard
                key={poem.id}
                id={poem.id}
                title={poem.title}
                author={poem.author_name ?? "Unknown author"}
                authorId={poem.author}
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
