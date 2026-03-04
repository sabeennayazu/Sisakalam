"use client";

import React from "react";
import Image from "next/image";

interface Author {
  id: string;
  name: string;
  profile_image: string;
}

interface AuthorCardProps {
  author: Author;
  genre: string;
}

export default function AuthorCard({ author, genre }: AuthorCardProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <div className="relative w-16 h-16 flex-shrink-0">
        <Image
          src={author.profile_image}
          alt={author.name}
          fill
          className="rounded-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop";
          }}
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{author.name}</h3>
        <p className="text-sm text-gray-500">{genre}</p>
      </div>
      <button className="px-6 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition-colors">
        Follow
      </button>
    </div>
  );
}
