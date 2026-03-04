"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { mockPoems } from "./mockData";

export default function PoemsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Poems
          </h1>
          <p className="text-lg text-gray-600">
            Explore beautiful verses and poetic expressions
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(mockPoems).map((poem) => (
            <Link key={poem.id} href={`/poems/${poem.id}`}>
              <div className="group cursor-pointer h-full flex flex-col">
                {/* Cover Image */}
                <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={poem.cover_image}
                    alt={poem.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {poem.genre}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {poem.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {poem.content.split("\n").slice(0, 3).join(" ")}...
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>by {poem.author.name}</span>
                      <div className="flex gap-3">
                        <span>👀 {(poem.views / 1000).toFixed(1)}K</span>
                        <span>❤️ {(poem.likes / 1000).toFixed(1)}K</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
