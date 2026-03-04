"use client";

import React from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewsSectionProps {
  totalReviews: number;
  averageRating: number;
}

export default function ReviewsSection({
  totalReviews,
  averageRating,
}: ReviewsSectionProps) {
  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: "1",
      author: "Reader123",
      rating: 5,
      text: "Amazing story! Couldn't put it down. The plot twists keep you engaged throughout.",
      date: "2 days ago",
    },
    {
      id: "2",
      author: "BookLover99",
      rating: 4,
      text: "Great narrative and world building. A few pacing issues in the middle but overall excellent.",
      date: "1 week ago",
    },
  ];

  return (
    <div className="space-y-4">
      {mockReviews.map((review) => (
        <div key={review.id} className="pb-4 border-b border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900">{review.author}</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
          <p className="text-gray-700">{review.text}</p>
        </div>
      ))}
    </div>
  );
}
