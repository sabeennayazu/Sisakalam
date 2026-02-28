"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Eye, Heart, MessageCircle } from "lucide-react";

const stories = [
  {
    id: 1,
    title: "My Fake Boyfriend",
    author: "S.A.A",
    genre: "love triangle",
    views: "100M",
    likes: "1.2K",
    comments: "1.2K",
    image: "/images/covers/cover1.jpg",
  },
  {
    id: 2,
    title: "Scars of Alera",
    author: "CloudWithStories",
    genre: "royalty",
    views: "1.1M",
    likes: "1.2K",
    comments: "1.2K",
    image: "/images/covers/cover2.jpg",
  },
  {
    id: 3,
    title: "Torment",
    author: "Rhea Novak",
    genre: "erotic",
    views: "17.7M",
    likes: "1.2K",
    comments: "1.2K",
    image: "/images/covers/cover3.jpg",
  },
  {
    id: 4,
    title: "The Taste of It",
    author: "Savanna Rose",
    genre: "smut",
    views: "14.7M",
    likes: "1.2K",
    comments: "1.2K",
    image: "/images/covers/cover4.jpg",
  },
  {
    id: 5,
    title: "You're my life",
    author: "Lily Adams",
    genre: "heartbreak",
    views: "8.3M",
    likes: "1.2K",
    comments: "1.2K",
    image: "/images/covers/cover5.jpg",
  },
  {
    id: 6,
    title: "Costantino",
    author: "AlphaLover",
    genre: "family",
    views: "5.6M", 
    likes: "1.2K",
    comments: "1.2K",
    image: "/images/covers/cover6.jpg",
  },
  {
    id: 7,
    title: "His Angel",
    author: "MafiaLover",
    genre: "mafia",
    views: "12.4M",
    likes: "1.2K",
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
    <section className="py-8 md:py-12 lg:py-14 px-4 md:px-6 lg:px-8 bg-white">
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
          {stories.map((story) => (
            <div
              key={story.id}
              className="min-w-[150px] md:min-w-[180px] lg:min-w-[200px] group cursor-pointer"
            >
              {/* Cover */}
              <div className="relative overflow-hidden rounded-lg md:rounded-xl">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 md:h-56 lg:h-72 object-cover 
                             group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* Genre */}
              <div className="mt-2 md:mt-3">
                <span className="text-xs px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-gray-700">
                  {story.genre}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-2 font-semibold text-xs md:text-sm text-black group-hover:text-black line-clamp-2">
                {story.title}
              </h3>

              {/* Author */}
              <p className="text-xs text-gray-500 line-clamp-1">
                 {story.author}
              </p>

              {/* Views */}
              <div className="flex items-center justify-between  text-xs text-gray-500 mt-1.5 md:mt-2">
                <div>

                <Eye size={14} />
                {story.views}
                </div>
                <div className="flex flex-row space-x-4">
                <div >
                  <Heart size={14} />
                  {story.likes}
                </div>
                <div>
                  <MessageCircle size={14} />
                  {story.comments} 
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