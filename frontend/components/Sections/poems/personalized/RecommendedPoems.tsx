"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";
import Link from "next/link";

const recommendedPoems = [
  {
    id: 1,
    title: "Your Story in Verses",
    author: "Personal Muse",
    genre: "personal",
    views: "450K",
    likes: 320,
    comments: "180",
    image: "/images/covers/cover11.jpg",
  },
  {
    id: 2,
    title: "Echo of You",
    author: "Poetry Sage",
    genre: "reflective",
    views: "520K",
    likes: 380,
    comments: "210",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&h=700&fit=crop",
  },
  {
    id: 3,
    title: "Golden Moments",
    author: "Light Bearer",
    genre: "inspirational",
    views: "380K",
    likes: 290,
    comments: "150",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=700&fit=crop",
  },
  {
    id: 4,
    title: "Kindred Souls",
    author: "Connection Weaver",
    genre: "empathetic",
    views: "490K",
    likes: 350,
    comments: "190",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=700&fit=crop",
  },
  {
    id: 5,
    title: "Your Wavelength",
    author: "Cosmic Poet",
    genre: "philosophical",
    views: "540K",
    likes: 410,
    comments: "230",
    image: "https://images.unsplash.com/photo-1513883049090-d0b7439799bf?w=500&h=700&fit=crop",
  },
];

export default function RecommendedPoems() {
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
          Recommended Poems for You
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
          {recommendedPoems.map((poem) => (
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
