"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  storyId: number;
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
  storyId,
  onBookmarkChange,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newState = !isBookmarked;
    setIsBookmarked(newState);
    onBookmarkChange?.(newState);
  };

  return (
    <button
      onClick={handleBookmarkClick}
      className="transition-all duration-200 hover:scale-110"
      title={isBookmarked ? "Remove bookmark" : "Bookmark this story"}
    >
      <Bookmark
        size={16}
        className={`transition-all duration-200 ${
          isBookmarked
            ? "fill-purple-500 text-purple-500"
            : "text-gray-500"
        }`}
      />
    </button>
  );
}
