"use client";

import React from "react";

interface StatsAndRatingProps {
  rating: number;
  reviewCount: number;
  totalChapters: number;
  status: "Ongoing" | "Completed";
  dailyUpdates: number;
}

export default function StatsAndRating({
  rating,
  reviewCount,
  totalChapters,
  status,
  dailyUpdates,
}: StatsAndRatingProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(rating) ? "text-yellow-400 text-lg" : "text-gray-300 text-lg"}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-2xl font-bold text-gray-900">{rating.toFixed(2)}</span>
        </div>
        <p className="text-xs text-gray-500">Based on {reviewCount.toLocaleString()} reader ratings</p>
      </div>

      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Chapters</span>
          <span className="font-semibold text-gray-900">{totalChapters}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Status</span>
          <span className={`font-semibold ${status === "Ongoing" ? "text-green-600" : "text-blue-600"}`}>
            {status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Daily Updates</span>
          <span className="font-semibold text-gray-900">{dailyUpdates} Chapters</span>
        </div>
      </div>
    </div>
  );
}
