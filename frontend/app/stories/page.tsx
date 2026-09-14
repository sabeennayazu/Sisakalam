"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import UniversalCard from "@/components/shared/UniversalCard";
import { getMediaUrl } from "@/utils/api";
import { getStories } from "@/utils/stories.api";
import type { PaginatedResponse, StoryApiRecord } from "@/types";

const PAGE_SIZE = 15;

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryApiRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const isMountedRef = useRef(true);

  const loadStories = useCallback(async (pageToLoad: number) => {
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
      const response = await getStories<PaginatedResponse<StoryApiRecord>>({
        page: pageToLoad,
        page_size: PAGE_SIZE,
      });
      if (!isMountedRef.current) return;
      const publishedStories = response.results.filter((story) => story.status === "published");
      setStories((current) => pageToLoad === 1 ? publishedStories : [...current, ...publishedStories]);
      setPage(pageToLoad);
      setHasMore(Boolean(response.next));
    } catch (loadError) {
      console.error("Unable to load stories", loadError);
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
    void loadStories(1);
    return () => {
      isMountedRef.current = false;
    };
  }, [loadStories]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) void loadStories(page + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Stories
          </h1>
          <p className="text-lg text-gray-600">
            Dive into captivating narratives and epic tales
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {isLoading && <p className="py-16 text-center text-sm text-gray-500">Loading stories...</p>}
        {!isLoading && error && (
          <div className="py-16 text-center text-sm text-red-600">
            <p>Unable to load stories.</p>
            <button type="button" onClick={() => void loadStories(1)} className="mt-2 underline">Please try again.</button>
          </div>
        )}
        {!isLoading && !error && stories.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-500">No stories have been published yet.</p>
        )}
        {!isLoading && !error && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <UniversalCard
                key={story.id}
                id={story.id}
                title={story.title}
                author={story.author_name ?? "Unknown author"}
                authorId={story.author}
                chapterSlug={story.first_chapter_slug}
                genre={story.genre_name ?? ""}
                image={getMediaUrl(story.image)}
                views={story.views}
                likes={story.likes}
                comments={story.comments_count}
                type="story"
                isMature={story.is_mature}
                status={story.status}
                isPrivate={story.is_private}
                description={story.synopsis}
                tags={story.tag_names}
              />
            ))}
          </div>
        )}
        {!isLoading && !error && stories.length > 0 && hasMore && (
          <div className="flex flex-col items-center gap-2 pt-12">
            {loadMoreError && <p className="text-sm text-red-600">Unable to load more stories.</p>}
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
