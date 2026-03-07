"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import { Search } from "lucide-react";

// --- MOCK DATA ---
const TRENDING_GENRES = [
  { name: "fantasy", count: "18K stories" },
  { name: "romance", count: "25K stories" },
  { name: "mystery", count: "12K stories" },
  { name: "thriller", count: "9K stories" },
  { name: "science-fiction", count: "11K stories" },
  { name: "horror", count: "8K stories" },
];

const POPULAR_GENRES = [
  "historical", "adventure", "drama", "comedy", "action", "young-adult", "paranormal", "poetry", "non-fiction", "biography"
];

const RECENTLY_EXPLORED_GENRES = [
  "cyberpunk", "urban-fantasy", "magical-realism", "steampunk", "dystopian"
];

export default function GenreDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this might navigate to search results or filter the genres below
      console.log("Searching for genre:", searchQuery);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          
          {/* Header & Search */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black uppercase mb-6">
              Discover Genres
            </h1>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Dive into the worlds that move you. Browse through our extensive collection of genres to find your next favorite story or poem.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search genres (e.g., fantasy, thriller)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-full py-4 pl-6 pr-14 text-black focus:outline-none focus:border-black transition"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          <div className="space-y-16">
            
            {/* Trending Genres Section */}
            <section>
              <h2 className="text-xl font-bold tracking-widest uppercase text-black mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
                <span className="text-red-500">🔥</span> Trending Genres
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TRENDING_GENRES.map((genre) => (
                  <Link 
                    key={genre.name} 
                    href={`/genre/${genre.name}`}
                    className="block p-4 border border-gray-100 rounded-lg hover:border-black hover:shadow-md transition group"
                  >
                    <div className="font-bold text-black uppercase mb-1 group-hover:text-amber-600 transition">
                      {genre.name.replace('-', ' ')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {genre.count}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recently Explored Genres Section */}
            <section>
              <h2 className="text-xl font-bold tracking-widest uppercase text-black mb-6 border-b border-gray-200 pb-2">
                Recently Explored
              </h2>
              <div className="flex flex-wrap gap-3">
                {RECENTLY_EXPLORED_GENRES.map((genre) => (
                  <Link 
                    key={genre} 
                    href={`/genre/${genre}`}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-black hover:text-white hover:border-black transition uppercase"
                  >
                    {genre.replace('-', ' ')}
                  </Link>
                ))}
              </div>
            </section>

            {/* Popular Genres Section */}
            <section>
              <h2 className="text-xl font-bold tracking-widest uppercase text-black mb-6 border-b border-gray-200 pb-2">
                All-Time Popular
              </h2>
              <div className="flex flex-wrap gap-3">
                {POPULAR_GENRES.map((genre) => (
                  <Link 
                    key={genre} 
                    href={`/genre/${genre}`}
                    className="px-4 py-2 border border-gray-300 rounded text-sm font-bold text-black hover:bg-black hover:text-white transition uppercase"
                  >
                    {genre.replace('-', ' ')}
                  </Link>
                ))}
              </div>
            </section>

          </div>

        </div>
      </div>
    </AuthGuard>
  );
}
