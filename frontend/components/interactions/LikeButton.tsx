"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  storyId: number;
  initialLikes: number;
  onLikeChange?: (isLiked: boolean, count: number) => void;
}

export default function LikeButton({
  storyId,
  initialLikes,
  onLikeChange,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      setIsLiked(false);
      setLikesCount(likesCount - 1);
      onLikeChange?.(false, likesCount - 1);
    } else {
      setIsLiked(true);
      setLikesCount(likesCount + 1);
      onLikeChange?.(true, likesCount + 1);
    }
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <button
      onClick={handleLikeClick}
      className="flex items-center gap-1 transition-all duration-200 hover:scale-110"
    >
      <Heart
        size={14}
        className={`transition-all duration-200 ${
          isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
        }`}
      />
      <span className="text-xs text-gray-500">{formatCount(likesCount)}</span>
    </button>
  );
}
