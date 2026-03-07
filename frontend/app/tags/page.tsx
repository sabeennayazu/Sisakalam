"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import { Search } from "lucide-react";

// --- MOCK DATA ---
const TRENDING_TAGS = [
  { name: "romance", count: "12K posts" },
  { name: "fantasy", count: "8.5K posts" },
  { name: "mystery", count: "6.2K posts" },
  { name: "scifi", count: "5K posts" },
  { name: "poetry", count: "15K posts" },
  { name: "thriller", count: "4.8K posts" },
];

const POPULAR_TAGS = [
  "horror", "adventure", "drama", "comedy", "historical", "action", "nonfiction", "shortstory", "haiku", "memoir"
];

const RECENTLY_USED_TAGS = [
  "love", "vampire", "magic", "space", "dragons", "detective"
];

export default function TagsDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this might navigate to search results or filter the tags below
      console.log("Searching for tag:", searchQuery);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          
          {/* Header & Search */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black uppercase mb-6">
              Discover Tags
            </h1>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Explore thousands of stories and poems categorized by tags. Find exactly what you're looking for or discover something entirely new.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search tags (e.g., romance, cyberpunk)..."
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
            
            {/* Trending Tags Section */}
            <section>
              <h2 className="text-xl font-bold tracking-widest uppercase text-black mb-6 flex items-center gap-2 border-b border-gray-200 pb-2">
                <span className="text-red-500">🔥</span> Trending Now
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TRENDING_TAGS.map((tag) => (
                  <Link 
                    key={tag.name} 
                    href={`/tags/${tag.name}`}
                    className="block p-4 border border-gray-100 rounded-lg hover:border-black hover:shadow-md transition group"
                  >
                    <div className="font-bold text-black uppercase mb-1 group-hover:text-orange-500 transition">
                      #{tag.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {tag.count}
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Recently Used Tags Section */}
            <section>
              <h2 className="text-xl font-bold tracking-widest uppercase text-black mb-6 border-b border-gray-200 pb-2">
                Recently Used
              </h2>
              <div className="flex flex-wrap gap-3">
                {RECENTLY_USED_TAGS.map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/tags/${tag}`}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-semibold text-gray-700 hover:bg-black hover:text-white hover:border-black transition uppercase"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </section>

            {/* Popular Tags Section */}
            <section>
              <h2 className="text-xl font-bold tracking-widest uppercase text-black mb-6 border-b border-gray-200 pb-2">
                All-Time Popular
              </h2>
              <div className="flex flex-wrap gap-3">
                {POPULAR_TAGS.map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/tags/${tag}`}
                    className="px-4 py-2 border border-gray-300 rounded text-sm font-bold text-black hover:bg-black hover:text-white transition uppercase"
                  >
                    #{tag}
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
