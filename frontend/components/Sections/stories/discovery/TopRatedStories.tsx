"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";

const topRatedStories = [
  {
    id: 1,
    title: "Empire of Dreams",
    author: "Luna Zhang",
    genre: "fantasy",
    views: "8.5M",
    likes: 2100,
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=700&fit=crop",
  },
  {
    id: 2,
    title: "Beyond the Stars",
    author: "Isaac Asimov II",
    genre: "sci-fi",
    views: "7.2M",
    likes: 1950,
    comments: "980",
    image: "https://images.unsplash.com/photo-1516979187457-635ffe35ff91?w=500&h=700&fit=crop",
  },
  {
    id: 3,
    title: "The Lighthouse Keeper",
    author: "Emma Stone",
    genre: "literary",
    views: "6.8M",
    likes: 1850,
    comments: "920",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=500&h=700&fit=crop",
  },
  {
    id: 4,
    title: "Crimson Tide",
    author: "William Blake",
    genre: "thriller",
    views: "9.1M",
    likes: 2340,
    comments: "1.4K",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=700&fit=crop",
  },
  {
    id: 5,
    title: "Whispers in the Rain",
    author: "Clara Wilson",
    genre: "romance",
    views: "7.9M",
    likes: 2110,
    comments: "1.1K",
    image: "https://images.unsplash.com/photo-1518984667514-155f3e95c84e?w=500&h=700&fit=crop",
  },
];

export default function TopRatedStories() {
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
          Top Rated Stories
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
          {topRatedStories.map((story) => (
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
