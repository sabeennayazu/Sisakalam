'use client';

import { ChapterData } from '@/hooks/useContinuousChapters';
import { Book } from 'lucide-react';

interface ChapterListPanelProps {
  chapters: ChapterData[];
  currentChapterNumber: number;
  onSelectChapter: (chapterNumber: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChapterListPanel({
  chapters,
  currentChapterNumber,
  onSelectChapter,
  isOpen,
  onClose,
}: ChapterListPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-screen w-80 overflow-y-auto bg-white shadow-lg">
        <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            <h2 className="text-lg font-bold text-gray-900">Chapters</h2>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => {
                onSelectChapter(chapter.chapter_number);
                onClose();
              }}
              className={`w-full px-6 py-4 text-left transition-colors ${
                currentChapterNumber === chapter.chapter_number
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-900 hover:bg-gray-50'
              }`}
            >
              <p className="text-sm font-semibold">
                Chapter {chapter.chapter_number}
              </p>
              <p className="mt-1 text-xs text-gray-500">{chapter.title}</p>
            </button>
          ))}
        </div>

        {/* No chapters message */}
        {chapters.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            <p className="text-sm">No chapters available</p>
          </div>
        )}
      </div>
    </div>
  );
}
