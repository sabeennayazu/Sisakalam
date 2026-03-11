"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";
import Link from "next/link";

const recommendedStories = [
  {
    id: 1,
    title: "The Forgotten City",
    author: "Michael Torres",
    genre: "adventure",
    views: "3.8M",
    likes: 1120,
    comments: "620",
    image: "/images/covers/cover10.jpg",
  },
  {
    id: 2,
    title: "Hearts Collide",
    author: "Rachel Green",
    genre: "romance",
    views: "4.2M",
    likes: 1340,
    comments: "720",
    image: "/images/covers/cover13.jpg",
  },
  {
    id: 3,
    title: "Shadow Dance",
    author: "Adrian Knight",
    genre: "dark romance",
    views: "3.5M",
    likes: 980,
    comments: "540",
    image: "/images/covers/cover14.jpg",
  },
  {
    id: 4,
    title: "Quantum Hearts",
    author: "Dr. Sarah Kim",
    genre: "sci-fi romance",
    views: "3.1M",
    likes: 850,
    comments: "450",
    image: "/images/covers/cover15.jpg",
  },
  {
    id: 5,
    title: "The Last Dance",
    author: "Caroline Hayes",
    genre: "contemporary",
    views: "4.5M",
    likes: 1450,
    comments: "800",
    image: "/images/covers/cover16.jpg",
  },
  {
    id: 6,
    title: "Eternal Flame",
    author: "James Morrison",
    genre: "fantasy",
    views: "3.9M",
    likes: 1200,
    comments: "680",
    image: "/images/covers/cover17.jpg",
  }
];

export default function RecommendedStories() {
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
    <section className=" px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold mb-6 md:mb-8">
          Recommended Stories for You
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
          {recommendedStories.map((story) => (
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
