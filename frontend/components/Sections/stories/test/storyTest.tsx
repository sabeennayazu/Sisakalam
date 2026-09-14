"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";
import Link from "next/link";
import { getStories } from "@/utils/stories.api";
import { getMediaUrl } from "@/utils/api";
import type { PaginatedResponse, StoryApiRecord } from "@/types";

const PAGE_SIZE = 50;

export default function StoryTest() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stories, setStories] = useState<StoryApiRecord[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStories = useCallback(async (pageToLoad: number) => {
    setLoading(true);
    setError(false);
    try {
      const response = await getStories<PaginatedResponse<StoryApiRecord>>({ page: pageToLoad, page_size: PAGE_SIZE });
      setStories((current) => pageToLoad === 1 ? response.results : [...current, ...response.results]);
      setHasMore(Boolean(response.next));
      setPage(pageToLoad);
    } catch (loadError) {
      console.error("Unable to load stories", loadError);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStories(1);
  }, [loadStories]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className=" px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold mb-6 md:mb-8">
          Storytest
        </h2>

        {/* Slider Buttons */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-2 md:-left-4 lg:-left-5 top-1/2 -translate-y-1/2
                     bg-white shadow-md rounded-full p-1 md:p-2
                     hover:shadow-lg transition z-10 text-black"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-2 md:-right-4 lg:-right-5 top-1/2 -translate-y-1/2
                     bg-white shadow-md rounded-full p-1 md:p-2
                     hover:shadow-lg transition z-10 text-black"
        >
          <ChevronRight size={18} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {stories.map((story) => (
            <UniversalCard
              key={story.id}
              id={story.id}
              title={story.title}
              author={story.author_name ?? "Unknown author"}
              genre={story.genre_name ?? ""}
              views={story.views}
              likes={story.likes}
              comments={story.comments_count}
              image={getMediaUrl(story.image)}
              type="story"
              isMature={story.is_mature}
              status={story.status}
            />
          ))}
        </div>
        {loading && <p className="py-8 text-center text-sm text-gray-500">Loading stories...</p>}
        {!loading && error && <div className="py-8 text-center text-sm text-red-600"><p>Unable to load stories.</p><button type="button" onClick={() => void loadStories(1)} className="mt-2 underline">Please try again.</button></div>}
        {!loading && !error && stories.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No stories have been published yet.</p>}
        {!loading && !error && hasMore && <button type="button" onClick={() => void loadStories(page + 1)} className="mt-4 block mx-auto border border-black px-4 py-2 text-sm">Load more stories</button>}
          <div className="relative flex items-center justify-center my-6 md:my-8 lg:my-10">
  {/* Gray Line */}
  <div className="absolute w-full border-t border-gray-300"></div>

  {/* Button */}
  <Link href="/genre" >
  <button className="relative bg-black text-white border border-black rounded-full px-6 py-2 text-sm transition-all duration-200 hover:bg-white hover:text-black cursor-pointer">
  See More
</button>
  </Link>
</div>
      </div>
    </section>
  );
}
