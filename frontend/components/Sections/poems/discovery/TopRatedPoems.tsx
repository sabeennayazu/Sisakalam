"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";

const topRatedPoems = [
  {
    id: 1,
    title: "The Ancient Oak",
    author: "Dr. Sarah Mitchell",
    genre: "epic",
    views: "3.2M",
    likes: 890,
    comments: "520",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=700&fit=crop",
  },
  {
    id: 2,
    title: "Infinite Love",
    author: "Elena Rossi",
    genre: "romantic",
    views: "2.8M",
    likes: 810,
    comments: "480",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=700&fit=crop",
  },
  {
    id: 3,
    title: "Eternity's Whisper",
    author: "Gabriel Woods",
    genre: "lyric",
    views: "3.5M",
    likes: 950,
    comments: "620",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=700&fit=crop",
  },
  {
    id: 4,
    title: "Twilight Reverie",
    author: "Isabella Moore",
    genre: "melancholic",
    views: "2.9M",
    likes: 830,
    comments: "490",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=700&fit=crop",
  },
  {
    id: 5,
    title: "Soul's Symphony",
    author: "Vincent Clarke",
    genre: "spiritual",
    views: "3.1M",
    likes: 870,
    comments: "540",
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=500&h=700&fit=crop",
  },
];

export default function TopRatedPoems() {
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
          Top Rated Poems
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
          {topRatedPoems.map((poem) => (
            <UniversalCard
              key={poem.id}
              id={poem.id}
              title={poem.title}
              author={poem.author}
              genre={poem.genre}
              views={poem.views}
              likes={poem.likes}
              comments={poem.comments}
              image={poem.image}
              type="poem"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
