"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Eye ,Heart, MessageCircle } from "lucide-react";

const poems = [
  {
    id: 1,
    title: "Echoes of Silence",
    author: "Clara M. Thorne",
    genre: "romanticism",
    views: "45M",
    likes: "1.2K",
    comments: "1.2K", 
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    id: 2,
    title: "Wilder Whispers",
    author: "Arlo Finch",
    genre: "nature",
    views: "12M",
    likes: "1.2K",
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  },
  {
    id: 3,
    title: "The Unseen Thread",
    author: "S. J. Sterling",
    genre: "free verse",
    views: "8.4M",
    likes: "1.2K",
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  },
  {
    id: 4,
    title: "Ode to the Summit",
    author: "Gregory Vance",
    genre: "epic",
    views: "2.1M",
    likes: "1.2K",
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  },
  {
    id: 5,
    title: "Melodies of May",
    author: "Elena Rousseau",
    genre: "lyric",
    views: "33M",
    likes: "1.2K",
    comments: "1.2K", 
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf",
  },
  {
    id: 6,
    title: "Concrete Pulse",
    author: "Leo Castelar",
    genre: "modern",
    views: "6.3M",
    likes: "1.2K",
    comments: "1.2K",
    image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
  },
];

export default function PoemsByGenre() {
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
          Poems by Genre
        </h2>

        {/* Slider Buttons */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute -left-2 md:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 
                     bg-white shadow-md rounded-full p-1 md:p-2 
                     hover:shadow-lg transition z-10 text-black border-gray-500"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute -right-2 md:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 
                     bg-white shadow-md rounded-full p-1 md:p-2 
                     hover:shadow-lg transition z-10 text-black border-gray-500"
        >
          <ChevronRight size={18} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {poems.map((poem) => (
            <div
              key={poem.id}
              className="min-w-[150px] md:min-w-[180px] lg:min-w-[200px] group cursor-pointer"
            >
              {/* Cover */}
              <div className="relative overflow-hidden rounded-lg md:rounded-xl">
                <img
                  src={`${poem.image}?auto=format&fit=crop&w=800&q=80`}
                  alt={poem.title}
                  className="w-full h-48 md:h-56 lg:h-72 object-cover 
                             group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Genre */}
              <div className="mt-2 md:mt-3">
                <span className="text-xs px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-gray-700">
                  {poem.genre}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-2 font-semibold text-xs md:text-sm text-black group-hover:text-black line-clamp-2">
                {poem.title}
              </h3>

              {/* Author */}
              <p className="text-xs text-gray-500 line-clamp-1">
                {poem.author}
              </p>

              {/* Views */}
              <div className="flex items-center justify-between  text-xs text-gray-500 mt-1.5 md:mt-2">
                <div>
                  <Eye size={14} />
                  {poem.views}
                </div>
                <div className="flex flex-row space-x-4">
                <div >
                  <Heart size={14} />
                  {poem.likes}
                </div>
                <div>
                  <MessageCircle size={14} />
                  {poem.comments} 
                </div>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
