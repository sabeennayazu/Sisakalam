"use client";

import React from "react";

interface PoemStatsProps {
  rating: number;
  reviewCount: number;
  publicationDate: string;
  wordCount: number;
  readingTime: number;
}

export default function PoemStats({
  rating,
  reviewCount,
  publicationDate,
  wordCount,
  readingTime,
}: PoemStatsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="mb-8">
        <div className="flex items-end gap-3 mb-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(rating) ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-4xl font-bold text-gray-900">{rating.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500">{reviewCount} ratings</p>
      </div>

      <div className="space-y-4 border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Publication Date</span>
          <span className="font-semibold text-gray-900 text-sm">{publicationDate}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Word Count</span>
          <span className="font-semibold text-gray-900 text-sm">{wordCount.toLocaleString()} words</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Reading Time</span>
          <span className="font-semibold text-gray-900 text-sm">{readingTime} min</span>
        </div>
      </div>
    </div>
  );
}
