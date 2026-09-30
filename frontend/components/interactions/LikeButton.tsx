"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { ApiError } from "@/utils/client";
import { isAuthenticated } from "@/utils/auth";
import {
  getCachedInteractionState,
  subscribeInteractionState,
  toggleLike,
  updateCachedInteractionState,
  type LikeTargetType,
} from "@/utils/interactions.api";

interface LikeButtonProps {
  targetId: number;
  targetType: LikeTargetType;
  initialLikes: number;
  initialLiked?: boolean;
  showLabel?: boolean;
  className?: string;
  onLikeChange?: (isLiked: boolean, count: number) => void;
}

export default function LikeButton({
  targetId,
  targetType,
  initialLikes,
  initialLiked = false,
  showLabel = false,
  className,
  onLikeChange,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedState = getCachedInteractionState(targetType, targetId);
    if (cachedState?.isLiked !== undefined) setIsLiked(cachedState.isLiked);
    else setIsLiked(initialLiked);
    if (cachedState?.likeCount !== undefined) setLikesCount(cachedState.likeCount);
    else setLikesCount(initialLikes);

    const key = `${targetType}:${targetId}`;
    return subscribeInteractionState((changedKey, state) => {
      if (changedKey !== key) return;
      if (state.isLiked !== undefined) setIsLiked(state.isLiked);
      if (state.likeCount !== undefined) setLikesCount(state.likeCount);
    });
  }, [initialLiked, initialLikes, targetId, targetType]);

  const handleLikeClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;
    if (!isAuthenticated()) {
      setError("Please log in to like this.");
      return;
    }

    const previousLiked = isLiked;
    const previousCount = likesCount;
    const optimisticLiked = !previousLiked;
    const optimisticCount = Math.max(0, previousCount + (optimisticLiked ? 1 : -1));
    setIsLiked(optimisticLiked);
    setLikesCount(optimisticCount);
    setError(null);
    setPending(true);

    try {
      const result = await toggleLike(targetType, targetId);
      const nextLiked = result.is_liked ?? result.liked;
      const nextCount = result.like_count ?? result.likes_count;
      setIsLiked(nextLiked);
      setLikesCount(nextCount);
      updateCachedInteractionState(targetType, targetId, { isLiked: nextLiked, likeCount: nextCount });
      onLikeChange?.(nextLiked, nextCount);
    } catch (likeError) {
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      setError(likeError instanceof ApiError && likeError.status === 401
        ? "Please log in to like this."
        : "Unable to update like. Please try again.");
    } finally {
      setPending(false);
    }
  };

  const formattedCount = likesCount >= 1000000
    ? `${(likesCount / 1000000).toFixed(1)}M`
    : likesCount >= 1000
      ? `${(likesCount / 1000).toFixed(1)}K`
      : likesCount.toString();

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={(event) => void handleLikeClick(event)}
        disabled={pending}
        aria-pressed={isLiked}
        aria-label={`${isLiked ? "Unlike" : "Like"}; ${likesCount} likes`}
        title={error ?? (isLiked ? "Unlike" : "Like")}
        className={`inline-flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:cursor-wait disabled:opacity-60 ${className ?? ""}`}
      >
        <Heart
          size={14}
          className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-500"}`}
        />
        {showLabel && <span>Like</span>}
        <span className="text-xs text-gray-500">{formattedCount}</span>
      </button>
      {error && <span role="alert" className="mt-1 max-w-40 text-[10px] text-red-600">{error}</span>}
    </span>
  );
}