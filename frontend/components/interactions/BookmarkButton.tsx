"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { ApiError } from "@/utils/client";
import { isAuthenticated } from "@/utils/auth";
import {
  getCachedInteractionState,
  subscribeInteractionState,
  toggleBookmark,
  updateCachedInteractionState,
  type BookmarkTargetType,
} from "@/utils/interactions.api";

interface BookmarkButtonProps {
  targetId: number;
  targetType: BookmarkTargetType;
  initialBookmarked?: boolean;
  showLabel?: boolean;
  className?: string;
  onBookmarkChange?: (isBookmarked: boolean) => void;
}

export default function BookmarkButton({
  targetId,
  targetType,
  initialBookmarked = false,
  showLabel = false,
  className,
  onBookmarkChange,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedState = getCachedInteractionState(targetType, targetId);
    setIsBookmarked(cachedState?.isBookmarked ?? initialBookmarked);
    const key = `${targetType}:${targetId}`;
    return subscribeInteractionState((changedKey, state) => {
      if (changedKey === key && state.isBookmarked !== undefined) setIsBookmarked(state.isBookmarked);
    });
  }, [initialBookmarked, targetId, targetType]);

  const handleBookmarkClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;
    if (!isAuthenticated()) {
      setError("Please log in to bookmark this.");
      return;
    }

    const previousState = isBookmarked;
    setIsBookmarked(!previousState);
    setError(null);
    setPending(true);
    try {
      const result = await toggleBookmark(targetType, targetId);
      setIsBookmarked(result.is_bookmarked);
      updateCachedInteractionState(targetType, targetId, { isBookmarked: result.is_bookmarked });
      onBookmarkChange?.(result.is_bookmarked);
    } catch (bookmarkError) {
      setIsBookmarked(previousState);
      setError(bookmarkError instanceof ApiError && bookmarkError.status === 401
        ? "Please log in to bookmark this."
        : "Unable to update bookmark. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={(event) => void handleBookmarkClick(event)}
      disabled={pending}
      aria-pressed={isBookmarked}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this content"}
      title={error ?? (isBookmarked ? "Remove bookmark" : "Bookmark this content")}
      className={`inline-flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:cursor-wait disabled:opacity-60 ${className ?? ""}`}
    >
      <Bookmark
        size={16}
        className={`transition-colors ${isBookmarked ? "fill-purple-500 text-purple-500" : "text-gray-500"}`}
      />
      {showLabel && <span>{isBookmarked ? "Bookmarked" : "Add to Bookmark"}</span>}
    </button>
  );
}