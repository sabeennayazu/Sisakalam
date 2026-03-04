"use client";

import React from "react";

interface LatestUpdate {
  title: string;
  date: string;
}

interface LatestUpdatesProps {
  updates: LatestUpdate[];
}

export default function LatestUpdates({ updates }: LatestUpdatesProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Updates</h3>
      <div className="space-y-3">
        {updates.map((update, index) => (
          <div
            key={index}
            className="px-4 py-3 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
          >
            <p className="font-medium text-gray-900 text-sm line-clamp-1">
              {update.title}
            </p>
            <p className="text-xs text-gray-500 mt-1">{update.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
