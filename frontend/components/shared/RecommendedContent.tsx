"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";

// --- MOCK DATA ---
const RECOMMENDED_STORIES = [
  { id: 101, title: "WHISPERS OF THE WIND", author: "Aria Thorne", likes: "3K", views: "12K", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=150&auto=format&fit=crop" },
  { id: 102, title: "THE SHADOW'S PATH", author: "Dorian Grey", likes: "1.5K", views: "8K", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=150&auto=format&fit=crop" },
  { id: 103, title: "INK AND BONE", author: "S. T. Coleridge", likes: "9.2K", views: "45K", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=150&auto=format&fit=crop" },
  { id: 104, title: "SHATTERED SOULS", author: "L. M. Montgomery", likes: "4.1K", views: "21K", image: "https://images.unsplash.com/photo-1478147424095-21d12ed2bcfe?q=80&w=150&auto=format&fit=crop" },
];

const RECOMMENDED_POEMS = [
  { id: 105, title: "OCEAN'S LULLABY", author: "Marina Frost", likes: "2.2K", views: "9K", image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=150&auto=format&fit=crop" },
  { id: 106, title: "DESERT FLOWER", author: "Cyprus Vance", likes: "1.8K", views: "6K", image: "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=150&auto=format&fit=crop" },
  { id: 107, title: "WINTER'S BREATH", author: "E. Snow", likes: "5K", views: "25K", image: "https://images.unsplash.com/photo-1447015237013-0e80b2786ddc?q=80&w=150&auto=format&fit=crop" },
  { id: 108, title: "SPRING AWAKENING", author: "Flora Ray", likes: "3.5K", views: "15K", image: "https://images.unsplash.com/photo-1506744626753-143bc3303d8b?q=80&w=150&auto=format&fit=crop" },
];

interface RecommendedContentProps {
  type: "STORIES" | "POEMS";
  contextContext: string; // e.g., "Category Tag" or "Genre"
  contextValue: string; // e.g., "romance" or "fantasy"
}

export default function RecommendedContent({ type, contextContext, contextValue }: RecommendedContentProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with real API call
    // Example: fetch(`/api/recommendations?type=${type}&context=${contextContext}&value=${contextValue}`)
    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      setData(type === "STORIES" ? RECOMMENDED_STORIES : RECOMMENDED_POEMS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [type, contextContext, contextValue]);

  return (
    <div className="mb-12">
      <h3 className="text-sm font-bold tracking-widest uppercase text-black mb-6 border-b border-gray-300 pb-2">
        Recommended For You
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.map((item) => (
            <div key={item.id} className="flex gap-4 cursor-pointer group">
              <div className="w-20 h-28 flex-shrink-0 relative overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="flex flex-col flex-1 py-1">
                <h4 className="font-bold text-xs text-black uppercase line-clamp-2 mb-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 italic mb-auto">
                  {item.author}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 mt-2">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {item.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    {item.views}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
