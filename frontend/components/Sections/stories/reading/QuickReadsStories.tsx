"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";

const quickReadsStories = [
  {
    id: 1,
    title: "The Coffee Shop",
    author: "Lisa Brown",
    genre: "short fiction",
    views: "1.2M",
    likes: 380,
    comments: "200",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=700&fit=crop",
  },
  {
    id: 2,
    title: "Midnight Confession",
    author: "Derek Walsh",
    genre: "flash fiction",
    views: "980K",
    likes: 290,
    comments: "150",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=700&fit=crop",
  },
  {
    id: 3,
    title: "Five Minutes",
    author: "Nina Costa",
    genre: "micro-fiction",
    views: "1.5M",
    likes: 420,
    comments: "240",
    image: "https://images.unsplash.com/photo-1518984667514-155f3e95c84e?w=500&h=700&fit=crop",
  },
  {
    id: 4,
    title: "Unexpected Joy",
    author: "Ben Rogers",
    genre: "feel-good",
    views: "1.8M",
    likes: 510,
    comments: "310",
    image: "https://images.unsplash.com/photo-1516979187457-635ffe35ff91?w=500&h=700&fit=crop",
  },
  {
    id: 5,
    title: "The Last Word",
    author: "Emma White",
    genre: "twist ending",
    views: "1.4M",
    likes: 390,
    comments: "220",
    image: "https://images.unsplash.com/photo-1507714179905-a0c17fae5dfe?w=500&h=700&fit=crop",
  },
];

export default function QuickReadsStories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;
    scrollRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 md:py-12 lg:py-14 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold mb-6 md:mb-8">
          Quick Reads
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
          {quickReadsStories.map((story) => (
            <UniversalCard
              key={story.id}
              id={story.id}
              title={story.title}
              author={story.author}
              genre={story.genre}
              views={story.views}
              likes={story.likes}
              comments={story.comments}
              image={story.image}
              type="story"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
