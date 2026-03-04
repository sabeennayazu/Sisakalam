"use client";

import React from "react";

interface ContentMetadataProps {
  views: number;
  likes: number;
  comments: number;
  bookmarks: number;
  createdAt: string;
  updatedAt?: string;
}

export default function ContentMetadata({
  views,
  likes,
  comments,
  bookmarks,
  createdAt,
  updatedAt,
}: ContentMetadataProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="flex flex-wrap gap-6 items-center text-sm text-gray-600 py-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <span className="text-lg">👁</span>
        <span>
          <strong>{formatNumber(views)}</strong> views
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg">❤️</span>
        <span>
          <strong>{formatNumber(likes)}</strong> likes
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg">💬</span>
        <span>
          <strong>{formatNumber(comments)}</strong> comments
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg">🔖</span>
        <span>
          <strong>{formatNumber(bookmarks)}</strong> bookmarks
        </span>
      </div>
      <div className="ml-auto text-xs text-gray-500">
        {formatDate(createdAt)}
        {updatedAt && updatedAt !== createdAt && (
          <span> · Updated {formatDate(updatedAt)}</span>
        )}
      </div>
    </div>
  );
}
