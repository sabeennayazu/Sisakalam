"use client";

import React from "react";

interface Chapter {
  chapter_id: string;
  chapter_title: string;
  chapter_number: number;
  content: string;
  created_at: string;
}

interface TableOfContentsProps {
  chapters: Chapter[];
  onSelectChapter: (chapterId: string) => void;
}

export default function TableOfContents({
  chapters,
  onSelectChapter,
}: TableOfContentsProps) {
  return (
    <div className="space-y-3">
      {chapters.map((chapter) => (
        <button
          key={chapter.chapter_id}
          onClick={() => onSelectChapter(chapter.chapter_id)}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="font-medium text-gray-900">
            Chapter {chapter.chapter_number}: {chapter.chapter_title}
          </div>
        </button>
      ))}
    </div>
  );
}
