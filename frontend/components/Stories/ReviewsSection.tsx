"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  author: string;
  rating?: number;
  text?: string;
  date: string;
}

interface ReviewsSectionProps {
  totalReviews: number;
  averageRating: number;
  reviewType?: "story" | "poem";
}

export default function ReviewsSection({
  totalReviews,
  averageRating,
  reviewType = "story",
}: ReviewsSectionProps) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState("");

  const mockReviews: Review[] =
    reviewType === "poem"
      ? [
          {
            id: "1",
            author: "PoetrySoul",
            rating: 5,
            text: "Beautiful imagery and emotional depth. Loved every line.",
            date: "3 days ago",
          },
          {
            id: "2",
            author: "VerseReader",
            rating: 4,
            text: "Very expressive poem. The rhythm flows nicely.",
            date: "1 week ago",
          },
          {
            id: "3",
            author: "SilentMuse",
            rating: 5,
            date: "2 weeks ago",
          },
          {
            id: "4",
            author: "NightReader",
            text: "This poem made me feel calm and reflective.",
            date: "3 weeks ago",
          },
        ]
      : [
          {
            id: "1",
            author: "Reader123",
            rating: 5,
            text: "Amazing story! Couldn't put it down. The plot twists are incredible.",
            date: "2 days ago",
          },
          {
            id: "2",
            author: "StoryAddict",
            rating: 4,
            text: "Great world building. Waiting for the next chapter!",
            date: "5 days ago",
          },
          {
            id: "3",
            author: "SilentReader",
            rating: 5,
            date: "1 week ago",
          },
          {
            id: "4",
            author: "BookLover99",
            rating: 3,
            text: "Interesting idea but pacing felt a bit slow.",
            date: "2 weeks ago",
          },
        ];

  const ratingDistribution =
    reviewType === "poem"
      ? [
          { star: 5, percent: 65 },
          { star: 4, percent: 20 },
          { star: 3, percent: 10 },
          { star: 2, percent: 3 },
          { star: 1, percent: 2 },
        ]
      : [
          { star: 5, percent: 70 },
          { star: 4, percent: 15 },
          { star: 3, percent: 10 },
          { star: 2, percent: 3 },
          { star: 1, percent: 2 },
        ];

  const StarRating = ({ count }: { count: number }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < count
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  const InteractiveStarRating = ({
    onSelect,
    hoverValue,
    selectedValue,
  }: {
    onSelect: (value: number) => void;
    hoverValue: number;
    selectedValue: number;
  }) => (
    <div className="flex gap-2 cursor-pointer">
      {[...Array(5)].map((_, i) => {
        const current = i + 1;
        return (
          <Star
            key={i}
            size={24}
            onClick={() => onSelect(current)}
            onMouseEnter={() => setHover(current)}
            onMouseLeave={() => setHover(0)}
            className={
              current <= (hoverValue || selectedValue)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="flex gap-8 items-start">
        <div>
          <p className="text-4xl text-black font-bold">
            {averageRating.toFixed(1)}
          </p>
          <StarRating count={Math.round(averageRating)} />
          <p className="text-sm text-gray-500">{totalReviews} reviews</p>
        </div>

        {/* Rating bars */}
        <div className="flex-1 space-y-1">
          {ratingDistribution.map((item) => (
            <div
              key={item.star}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <span className="w-3">{item.star}</span>
              <Star size={14} className="text-gray-400" />

              <div className="flex-1 h-2 bg-gray-300 rounded">
                <div
                  className="h-2 bg-yellow-400 rounded"
                  style={{ width: `${item.percent}%` }}
                />
              </div>

              <span className="text-gray-500">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review */}
      <div className="border border-gray-500 rounded-lg p-4 space-y-3">
        <p className="font-semibold text-black">
          {reviewType === "poem" ? "Rate this poem" : "Write a Review"}
        </p>

        <InteractiveStarRating
          onSelect={setRating}
          hoverValue={hover}
          selectedValue={rating}
        />

        <textarea
          placeholder={
            reviewType === "poem"
              ? "Share your thoughts about this poem (optional)"
              : "Write a comment (optional)"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-400 rounded-md p-2 text-sm text-black focus:outline-none focus:ring"
          rows={3}
        />

        <button className="px-4 py-2 text-sm bg-black text-white rounded-md">
          {reviewType === "poem" ? "Submit Review" : "Submit Review"}
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-5">
        {mockReviews.map((review) => (
          <div key={review.id} className="border-b border-gray-500 pb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-black">{review.author}</p>

                {review.rating && <StarRating count={review.rating} />}
              </div>

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