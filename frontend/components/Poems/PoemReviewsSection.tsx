"use client";

import React, { useState } from "react";

interface Review {
  id: string;
  author: string;
  text?: string;
  date: string;
}

interface PoemReviewsSectionProps {
  totalReviews: number;
}

export default function PoemReviewsSection({
  totalReviews,
}: PoemReviewsSectionProps) {
  const [comment, setComment] = useState("");

  const mockReviews: Review[] = [
    {
      id: "1",
      author: "Reader123",
      text: "What a beautiful piece! The imagery is so vivid and emotionally resonant.",
      date: "2 days ago",
    },
    {
      id: "2",
      author: "PoetryLover",
      text: "The use of metaphors here is masterful. Really spoke to my heart.",
      date: "5 days ago",
    },
    {
      id: "3",
      author: "SilentReader",
      text: "Simply stunning. This poem will stay with me for a long time.",
      date: "1 week ago",
    },
    {
      id: "4",
      author: "WordSmith",
      text: "The rhythm and flow are impeccable. Bravo!",
      date: "2 weeks ago",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Write Comment */}
      <div className="border border-gray-500 rounded-lg p-4 space-y-3">
        <p className="font-semibold text-black">Leave a Comment</p>

        <textarea
          placeholder="Share your thoughts on this poem..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-400 rounded-md p-2 text-sm text-black focus:outline-none focus:ring"
          rows={3}
        />

        <button className="px-4 py-2 text-sm bg-black text-white rounded-md">
          Submit Comment
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-5">
        <p className="text-lg font-semibold text-black mb-4">
          Comments ({totalReviews})
        </p>
        
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-500 pb-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-medium text-black">{review.author}</p>
              <span className="text-xs text-gray-500">{review.date}</span>
            </div>

            {review.text && (
              <p className="text-gray-700 text-sm">{review.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
