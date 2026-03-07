"use client";

import { useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { Eye, MessageCircle, Filter, ArrowUpDown } from "lucide-react";
import LikeButton from "@/components/interactions/LikeButton";
import BookmarkButton from "@/components/interactions/BookmarkButton";
import RecommendedContent from "@/components/shared/RecommendedContent";

// --- MOCK DATA ---

const MOCK_STORIES = [
  { id: 1, title: "THE ETERNAL WHISPER", author: "Eleanor Vance", likes: 1200, comments: 45, views: "5K", image: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=300&auto=format&fit=crop" },
  { id: 2, title: "ECHOES OF HEART", author: "Julian Thorne", likes: 890, comments: 30, views: "3K", image: "https://images.unsplash.com/photo-1474932430478-367d26bef064?q=80&w=300&auto=format&fit=crop" },
  { id: 3, title: "CRIMSON PETALS", author: "Sophia Reed", likes: 2100, comments: 120, views: "8K", image: "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=300&auto=format&fit=crop" },
  { id: 4, title: "MIDNIGHT SERENADE", author: "Liam Blackwood", likes: 1500, comments: 60, views: "6K", image: "https://images.unsplash.com/photo-1447015237013-0e80b2786ddc?q=80&w=300&auto=format&fit=crop" },
  { id: 5, title: "VELVET MOONLIGHT", author: "Isabella Gray", likes: 750, comments: 25, views: "2K", image: "https://images.unsplash.com/photo-1507369512168-9b7e7ab6d140?q=80&w=300&auto=format&fit=crop" },
  { id: 6, title: "SILENT PROMISES", author: "Nathaniel Cole", likes: 1100, comments: 50, views: "4K", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=300&auto=format&fit=crop" },
  { id: 7, title: "GILDED LOVE", author: "Clara Beaumont", likes: 900, comments: 35, views: "3.5K", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop" },
  { id: 8, title: "HIDDEN RHYTHMS", author: "Marcus Vane", likes: 2500, comments: 150, views: "10K", image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=300&auto=format&fit=crop" },
  { id: 9, title: "AUTUMN EMBERS", author: "Elena Rossi", likes: 1300, comments: 70, views: "5.5K", image: "https://images.unsplash.com/photo-1506744626753-143bc3303d8b?q=80&w=300&auto=format&fit=crop" },
  { id: 10, title: "WOVEN DESTINIES", author: "Gabriel Frost", likes: 1800, comments: 90, views: "7K", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=300&auto=format&fit=crop" },
];

const MOCK_POEMS = [
  { id: 11, title: "WHISPERS OF THE SOUL", author: "Elena Rossi", likes: 950, comments: 20, views: "2.5K", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=300&auto=format&fit=crop" },
  { id: 12, title: "FRAGMENTS", author: "Isabella Gray", likes: 1100, comments: 45, views: "3K", image: "https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=300&auto=format&fit=crop" },
  { id: 13, title: "ECLIPSED HEARTS", author: "Julian Thorne", likes: 2000, comments: 90, views: "7.5K", image: "https://images.unsplash.com/photo-1507369512168-9b7e7ab6d140?q=80&w=300&auto=format&fit=crop" },
  { id: 14, title: "RISING DAWN", author: "Liam Blackwood", likes: 800, comments: 15, views: "1.8K", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=300&auto=format&fit=crop" },
  { id: 15, title: "STARRY NIGHTS", author: "Eleanor Vance", likes: 1500, comments: 60, views: "5.2K", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop" },
];

interface ContentResultsDisplayProps {
  title: string;
  label: string;
}

export default function ContentResultsDisplay({ title, label }: ContentResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<"STORIES" | "POEMS">("STORIES");
  // Simulating loading state for future API integration
  const [isLoading, setIsLoading] = useState(false);

  const mainData = activeTab === "STORIES" ? MOCK_STORIES : MOCK_POEMS;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-white py-14">
        {/* Main Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column - Main Content (Approx 75%) */}
            <div className="flex-1">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4">
                <div>
                  <p className="text-gray-500 text-sm font-semibold tracking-widest uppercase mb-1">
                    {label}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-black uppercase">
                    #{title}
                  </h1>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                  <button className="flex items-center gap-2 px-4 py-2 border border-black text-black text-sm font-bold hover:bg-gray-50 transition">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 11h10v2H7zM4 7h16v2H4zm6 8h4v2h-4z"/>
                    </svg>
                    FILTER
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-black text-black text-sm font-bold hover:bg-gray-50 transition">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
                    </svg>
                    SORT
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-8 mb-8 border-b border-gray-300">
                <button
                  onClick={() => setActiveTab("STORIES")}
                  className={`pb-3 text-sm font-bold tracking-widest uppercase transition ${
                    activeTab === "STORIES"
                      ? "text-black border-b-4 border-black"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Stories
                </button>
                <button
                  onClick={() => setActiveTab("POEMS")}
                  className={`pb-3 text-sm font-bold tracking-widest uppercase transition ${
                    activeTab === "POEMS"
                      ? "text-black border-b-4 border-black"
                      : "text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Poems
                </button>
              </div>

              {/* Grid Content */}
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
              ) : mainData.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {mainData.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      {/* Cover */}
                      <div className="relative overflow-hidden mb-3 md:mb-4 bg-gray-100 aspect-[3/4]">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        {/* Bookmark Button - Top Right */}
                        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/20 rounded-full p-1.5 md:p-2 shadow-md hover:shadow-lg transition">
                          <BookmarkButton storyId={item.id} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-sm text-black group-hover:text-black line-clamp-2 uppercase">
                        {item.title}
                      </h3>

                      {/* Author */}
                      <p className="text-xs text-gray-500 line-clamp-1 italic mt-1">
                        {item.author}
                      </p>

                      {/* Interactions */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                         <LikeButton storyId={item.id} initialLikes={item.likes} />
                         <div className="flex items-center gap-1">
                           <MessageCircle size={14} className="text-gray-400" />
                           {item.comments}
                         </div>
                         <div className="flex items-center gap-1">
                           <Eye size={14} className="text-gray-400" />
                           {item.views}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  No {activeTab.toLowerCase()} found for this {label.toLowerCase()}.
                </div>
              )}

              {/* Discover More Button */}
              {mainData.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <button className="bg-black text-white px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition">
                    Discover More
                  </button>
                </div>
              )}

            </div>

            {/* Right Column - Sidebar (Approx 25%) */}
            <div className="w-full lg:w-72 flex-shrink-0 mt-12 lg:mt-0">
              
              {/* Recommended For You Section */}
              <RecommendedContent 
                type={activeTab} 
                contextContext={label} 
                contextValue={title} 
              />

              {/* Weekly Newsletter Section */}
              <div className="bg-black text-white p-6 md:p-8 flex flex-col items-center text-center">
                <h3 className="text-sm font-bold tracking-widest uppercase mb-2">
                  Weekly Newsletter
                </h3>
                <p className="text-xs text-gray-400 mb-6 italic">
                  The best stories, delivered every Monday.
                </p>
                
                <input
                  type="email"
                  placeholder="email address"
                  className="w-full bg-white text-black px-4 py-2 text-sm mb-4 outline-none"
                />
                
                <button className="w-full border border-white text-white py-2 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition">
                  Join the Circle
                </button>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </AuthGuard>
  );
}
