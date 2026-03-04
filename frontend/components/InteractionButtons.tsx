"use client";

import React, { useState } from "react";

interface InteractionButtonsProps {
  initialLikes: number;
  initialBookmarks: number;
  initialComments: number;
  onLike?: () => void;
  onBookmark?: () => void;
  onComment?: () => void;
}

export default function InteractionButtons({
  initialLikes,
  initialBookmarks,
  initialComments,
  onLike,
  onBookmark,
  onComment,
}: InteractionButtonsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    }
    onLike?.();
  };

  const handleBookmark = () => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev + 1);
      setIsBookmarked(true);
    } else {
      setBookmarks((prev) => prev - 1);
      setIsBookmarked(false);
    }
    onBookmark?.();
  };

  const handleComment = () => {
    onComment?.();
  };

  return (
    <div className="flex gap-6 items-center text-sm">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          isLiked
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <span className="text-lg">♥</span>
        <span className="font-medium">{likes}</span>
      </button>

      <button
        onClick={handleComment}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
      >
        <span className="text-lg">💬</span>
        <span className="font-medium">{initialComments}</span>
      </button>

      <button
        onClick={handleBookmark}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
          isBookmarked
            ? "bg-blue-100 text-blue-600"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <span className="text-lg">🔖</span>
        <span className="font-medium">{bookmarks}</span>
      </button>
    </div>
  );
}
