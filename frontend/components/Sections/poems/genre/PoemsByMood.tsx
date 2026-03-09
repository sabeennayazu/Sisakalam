"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";

const poems = [
  {
    id: 1,
    title: "Echoes of Silence",
    author: "Clara M. Thorne",
    genre: "romanticism",
    views: "45M",
    likes: 1200,
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    id: 2,
    title: "Wilder Whispers",
    author: "Arlo Finch",
    genre: "nature",
    views: "12M",
    likes: 1200,
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  {
    id: 3,
    title: "The Unseen Thread",
    author: "S. J. Sterling",
    genre: "free verse",
    views: "8.4M",
    likes: 1200,
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  },
  {
    id: 4,
    title: "Ode to the Summit",
    author: "Gregory Vance",
    genre: "epic",
    views: "2.1M",
    likes: 1200,
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: 5,
    title: "Melodies of May",
    author: "Elena Rousseau",
    genre: "lyric",
    views: "33M",
    likes: 1200,
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf",
  },
  {
    id: 6,
    title: "Concrete Pulse",
    author: "Leo Castelar",
    genre: "modern",
    views: "6.3M",
    likes: 1200,
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  },
];

export default function PoemsByMood() {
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
          Poems by Mood
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
          {poems.map((poem) => (
            <UniversalCard
              key={poem.id}
              id={poem.id}
              title={poem.title}
              author={poem.author}
              genre={poem.genre}
              views={poem.views}
              likes={poem.likes}
              comments={poem.comments}
              image={`${poem.image}?auto=format&fit=crop&w=800&q=80`}
              type="poem"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
