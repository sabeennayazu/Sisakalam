"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";
import Link from "next/link";

const stories = [
  {
    id: 1,
    title: "My Fake Boyfriend",
    author: "S.A.A",
    genre: "love triangle",
    views: "100M",
    likes: 1200,
    comments: "1.2K",
    image: "/images/covers/cover1.jpg",
  },
  {
    id: 2,
    title: "Scars of Alera",
    author: "CloudWithStories",
    genre: "royalty",
    views: "1.1M",
    likes: 1200,
    comments: "1.2K",
    image: "/images/covers/cover2.jpg",
  },
  {
    id: 3,
    title: "Torment",
    author: "Rhea Novak",
    genre: "erotic",
    views: "17.7M",
    likes: 1200,
    comments: "1.2K",
    image: "/images/covers/cover3.jpg",
  },
  {
    id: 4,
    title: "The Taste of It",
    author: "Savanna Rose",
    genre: "smut",
    views: "14.7M",
    likes: 1200,
    comments: "1.2K",
    image: "/images/covers/cover4.jpg",
  },
  {
    id: 5,
    title: "You're my life",
    author: "Lily Adams",
    genre: "heartbreak",
    views: "8.3M",
    likes: 1200,
    comments: "1.2K",
    image: "/images/covers/cover5.jpg",
  },
  {
    id: 6,
    title: "Costantino",
    author: "AlphaLover",
    genre: "family",
    views: "5.6M",
    likes: 1200,
    comments: "1.2K",
    image: "/images/covers/cover6.jpg",
  },
  {
    id: 7,
    title: "His Angel",
    author: "MafiaLover",
    genre: "mafia",
    views: "12.4M",
    likes: 1200,
    comments: "1.2K",
    image: "/images/covers/cover7.jpg",
  },
];

export default function StoriesByGenre() {
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
    <section className="  px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto relative">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl text-black font-semibold mb-6 md:mb-8">
          Stories by Genre
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