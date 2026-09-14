"use client";

import PoemStats from "@/components/Poems/PoemStats";
import ReviewsSection from "@/components/Poems/PoemReviewsSection";
import Tags from "@/components/Poems/Tags";

interface PoemDetailsSidebarProps {
  rating: number;
  reviewCount: number;
  publicationDate: string;
  wordCount: number;
  readingTime: number;
  tags: string[];
  totalReviews: number;
  averageRating: number;
  reviewType?: "poem" | "story";
}

export default function PoemDetailsSidebar({
  rating,
  reviewCount,
  publicationDate,
  wordCount,
  readingTime,
  tags,
  totalReviews,
  averageRating,
  reviewType = "poem",
}: PoemDetailsSidebarProps) {
  return (
    <div className="space-y-6">
      <PoemStats
        rating={rating}
        reviewCount={reviewCount}
        publicationDate={publicationDate}
        wordCount={wordCount}
        readingTime={readingTime}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <ReviewsSection
          totalReviews={totalReviews}
          averageRating={averageRating}
          reviewType={reviewType}
        />
      </div>

      <Tags tags={tags} />

      <button className="w-full px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-sm">
        🚩 REPORT CONTENT
      </button>
    </div>
  );
}
