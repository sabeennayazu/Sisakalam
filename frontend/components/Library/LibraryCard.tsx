"use client";

import { Eye, Heart, MessageCircle } from "lucide-react";

interface LibraryItem {
  id: number;
  title: string;
  author: string;
  genre: string;
  type: "poem" | "story";
  views: string;
  likes: string;
  comments: string;
  image: string;
}

export default function LibraryCard({ item }: { item: LibraryItem }) {
  return (
    <div className="group cursor-pointer">
      {/* Cover */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={`${item.image}?auto=format&fit=crop&w=800&q=80`}
          alt={item.title}
          className="w-full h-60 object-cover 
                     group-hover:scale-105 transition duration-300"
        />

        {/* Type Badge */}
        <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black text-white capitalize">
          {item.type}
        </span>
      </div>

      {/* Genre */}
      <div className="mt-3">
        <span className="text-xs px-3 py-1 bg-gray-100 rounded-full text-gray-700 capitalize">
          {item.genre}
        </span>
      </div>

      {/* Title */}
      <h3 className="mt-2 font-semibold text-sm text-black line-clamp-2">
        {item.title}
      </h3>

      {/* Author */}
      <p className="text-xs text-gray-500 line-clamp-1">
        {item.author}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
        <div className="flex items-center gap-1">
          <Eye size={14} />
          {item.views}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart size={14} />
            {item.likes}
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            {item.comments}
          </div>
        </div>
      </div>
    </div>
  );
}